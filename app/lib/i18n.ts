import type {I18nBase, Storefront} from '@shopify/hydrogen';
import type {
  CountryCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';

/**
 * Every country/language pair enabled in Shopify gets its own URL prefix:
 * `/{language}-{country}`, e.g. `/en-us`, `/de-at`, `/pt-br-br` (PT_BR + BR).
 * The default locale is served without a prefix.
 */
export type I18nLocale = I18nBase & {pathPrefix: string};

export type AvailableLocale = I18nLocale & {
  countryName: string;
  languageName: string;
  currency: string;
};

export const DEFAULT_LOCALE: I18nLocale = {
  language: 'IT',
  country: 'IT',
  pathPrefix: '',
};

const LOCALE_SEGMENT = /^([a-z]{2}(?:-[a-z]{2})?)-([a-z]{2})$/i;

export function toPathPrefix({language, country}: I18nBase) {
  if (
    language === DEFAULT_LOCALE.language &&
    country === DEFAULT_LOCALE.country
  ) {
    return '';
  }
  return `/${language.toLowerCase().replace('_', '-')}-${country.toLowerCase()}`;
}

function parseLocaleSegment(segment?: string): I18nLocale | null {
  const match = segment ? LOCALE_SEGMENT.exec(segment) : null;
  if (!match) return null;

  const language = match[1].toUpperCase().replace('-', '_') as LanguageCode;
  const country = match[2].toUpperCase() as CountryCode;
  return {language, country, pathPrefix: `/${segment!.toLowerCase()}`};
}

/**
 * Reads the locale from the first path segment. The result is only syntactic:
 * the `($locale)` layout route checks it against the locales enabled in Shopify.
 */
export function getLocaleFromRequest(request: Request): I18nLocale {
  const firstSegment = new URL(request.url).pathname.split('/')[1];
  return parseLocaleSegment(firstSegment) ?? DEFAULT_LOCALE;
}

/** The locale prefix of a pathname (`/en-us`), or '' for the default locale. */
export function getPathPrefix(pathname: string) {
  const firstSegment = pathname.split('/')[1];
  return parseLocaleSegment(firstSegment)
    ? `/${firstSegment!.toLowerCase()}`
    : '';
}

/** Removes a leading locale segment (ours or a Shopify Markets subfolder). */
export function stripLocalePrefix(pathname: string) {
  const [, firstSegment, ...rest] = pathname.split('/');
  if (
    !parseLocaleSegment(firstSegment) &&
    !/^[a-z]{2}$/i.test(firstSegment ?? '')
  ) {
    return pathname;
  }
  return `/${rest.join('/')}`;
}

/** Prefixes an absolute in-app path with the locale, unless it already has one. */
export function localizePath(path: string, pathPrefix: string) {
  if (!pathPrefix || !path.startsWith('/') || path.startsWith('//'))
    return path;
  if (parseLocaleSegment(path.split(/[/?#]/)[1])) return path;
  if (path === '/') return pathPrefix;
  if (path.startsWith('/?') || path.startsWith('/#'))
    return pathPrefix + path.slice(1);
  return pathPrefix + path;
}

const AVAILABLE_LOCALES_QUERY = `#graphql
  query AvailableLocales {
    localization {
      availableCountries {
        isoCode
        name
        currency { isoCode }
        availableLanguages { isoCode endonymName }
      }
    }
  }
` as const;

/** All country/language pairs enabled in the Shopify Markets settings. */
export async function getAvailableLocales(
  storefront: Storefront,
): Promise<AvailableLocale[]> {
  const {localization} = await storefront.query(AVAILABLE_LOCALES_QUERY, {
    cache: storefront.CacheLong(),
  });

  return localization.availableCountries.flatMap((country) =>
    country.availableLanguages.map((language) => ({
      language: language.isoCode,
      country: country.isoCode,
      pathPrefix: toPathPrefix({
        language: language.isoCode,
        country: country.isoCode,
      }),
      countryName: country.name,
      languageName: language.endonymName,
      currency: country.currency.isoCode,
    })),
  );
}
