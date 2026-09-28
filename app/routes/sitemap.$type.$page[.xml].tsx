import type {Route} from './+types/sitemap.$type.$page[.xml]';
import {getSitemap} from '@shopify/hydrogen';
import {getAvailableLocales} from '~/lib/i18n';

export async function loader({
  request,
  params,
  context: {storefront},
}: Route.LoaderArgs) {
  // hreflang (e.g. "en-US") -> URL prefix (e.g. "/en-us"), from the locales enabled in Shopify
  const prefixByHreflang = new Map<string, string>();
  for (const locale of await getAvailableLocales(storefront)) {
    const hreflang = `${locale.language.split('_')[0].toLowerCase()}-${locale.country}`;
    if (!prefixByHreflang.has(hreflang)) {
      prefixByHreflang.set(hreflang, locale.pathPrefix);
    }
  }

  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: [...prefixByHreflang.keys()],
    getLink: ({type, baseUrl, handle, locale}) => {
      const prefix = locale ? (prefixByHreflang.get(locale) ?? '') : '';
      return `${baseUrl}${prefix}/${type}/${handle}`;
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
