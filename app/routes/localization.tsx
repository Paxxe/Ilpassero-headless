import {redirect} from 'react-router';
import type {Route} from './+types/localization';

const ACTIVE_COUNTRIES_QUERY = `#graphql
  query ActiveCountries {
    localization {
      availableCountries { isoCode }
    }
  }
` as const;

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const country = String(formData.get('country') || '').toUpperCase();

  if (!/^[A-Z]{2}$/.test(country)) {
    throw new Response('Invalid country code', {status: 400});
  }

  const {localization} = await context.storefront.query(ACTIVE_COUNTRIES_QUERY);
  if (!localization.availableCountries.some((activeCountry) => activeCountry.isoCode === country)) {
    throw new Response('This country is not available for the storefront', {status: 400});
  }

  context.session.set('country', country);

  const requestUrl = new URL(request.url);
  const returnTo = String(formData.get('returnTo') || '/');
  const target = new URL(returnTo, requestUrl.origin);
  if (target.origin !== requestUrl.origin) {
    throw new Response('Invalid return URL', {status: 400});
  }

  target.searchParams.set('country', country);
  return redirect(`${target.pathname}${target.search}${target.hash}`);
}