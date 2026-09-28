import {redirect} from 'react-router';
import type {Route} from './+types/localization';
import {getAvailableLocales, localizePath, stripLocalePrefix} from '~/lib/i18n';

/**
 * Country/language selector endpoint.
 * POST `pathPrefix` (e.g. "/en-us", "" for Italy/Italian) and `returnTo`
 * (the current path) to switch locale and keep the visitor on the same page.
 */
export async function action({request, context}: Route.ActionArgs) {
  const {storefront, cart} = context;
  const formData = await request.formData();
  const pathPrefix = String(formData.get('pathPrefix') ?? '').toLowerCase();

  const locales = await getAvailableLocales(storefront);
  const locale = locales.find((item) => item.pathPrefix === pathPrefix);
  if (!locale) {
    throw new Response('This locale is not available for the storefront', {
      status: 400,
    });
  }

  const requestUrl = new URL(request.url);
  const returnTo = String(formData.get('returnTo') || '/');
  const target = new URL(returnTo, requestUrl.origin);
  if (target.origin !== requestUrl.origin) {
    throw new Response('Invalid return URL', {status: 400});
  }

  // Keep prices and availability in the cart consistent with the new country
  const headers = new Headers();
  if (cart.getCartId()) {
    const result = await cart.updateBuyerIdentity({
      countryCode: locale.country,
    });
    if (result.cart?.id) {
      cart
        .setCartId(result.cart.id)
        .forEach((value, key) => headers.append(key, value));
    }
  }

  const path = localizePath(
    stripLocalePrefix(target.pathname),
    locale.pathPrefix,
  );
  return redirect(`${path}${target.search}${target.hash}`, {headers});
}
