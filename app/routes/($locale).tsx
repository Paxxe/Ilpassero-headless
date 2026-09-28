import {Outlet, redirect} from 'react-router';
import type {Route} from './+types/($locale)';
import {getAvailableLocales, toPathPrefix} from '~/lib/i18n';

/**
 * Validates the optional `/{language}-{country}` prefix against the
 * country/language pairs enabled in Shopify. Unknown prefixes return 404 and
 * the default locale's prefix (/it-it) redirects to the unprefixed URL.
 */
export async function loader({params, request, context}: Route.LoaderArgs) {
  if (!params.locale) return null;

  const {storefront} = context;
  const segment = params.locale.toLowerCase();
  const locales = await getAvailableLocales(storefront);
  const isDefault = locales.some(
    (locale) =>
      locale.pathPrefix === '' &&
      segment === `${locale.language.toLowerCase().replace('_', '-')}-${locale.country.toLowerCase()}`,
  );

  if (isDefault || segment !== params.locale) {
    const url = new URL(request.url);
    url.pathname = url.pathname.replace(
      `/${params.locale}`,
      isDefault ? '' : `/${segment}`,
    ) || '/';
    throw redirect(url.toString(), 301);
  }

  const isAvailable = locales.some(
    (locale) =>
      locale.pathPrefix === `/${segment}` &&
      locale.pathPrefix === toPathPrefix(storefront.i18n),
  );
  if (!isAvailable) {
    throw new Response(`${new URL(request.url).pathname} not found`, {
      status: 404,
    });
  }

  return null;
}

export default function LocaleLayout() {
  return <Outlet />;
}
