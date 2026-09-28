import type {I18nBase} from '@shopify/hydrogen';

export function getLocaleFromRequest(request: Request, sessionCountry?: string): I18nBase {
  const defaultLocale: I18nBase = {language: 'EN', country: 'US'};
  const supportedLocales = {
    US: 'EN',
    IT: 'IT',
    ES: 'ES',
    FR: 'FR',
    DE: 'DE',
    JP: 'JA',
  } as Partial<Record<I18nBase['country'], I18nBase['language']>>;

  const url = new URL(request.url);
  const firstSubdomain = url.hostname
    .split('.')[0]
    ?.toUpperCase() as keyof typeof supportedLocales;
  const selectedCountry = (url.searchParams.get('country') || sessionCountry)?.toUpperCase() as I18nBase['country'] | undefined;

  const country = selectedCountry || firstSubdomain;
  return supportedLocales[country]
    ? {language: supportedLocales[country]!, country}
    : defaultLocale;
}
