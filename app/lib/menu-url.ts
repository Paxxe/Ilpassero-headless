type MenuUrlInput = {
  url?: string | null;
  type?: string | null;
};

type MenuUrlDomains = {
  publicStoreDomain?: string | null;
  primaryDomainUrl?: string | null;
};

const shopifyResourcePath = /^\/(?:collections|products|pages|blogs|policies|search)(?:\/|$)/i;
const shopifyResourceTypes = new Set([
  'ARTICLE',
  'BLOG',
  'COLLECTION',
  'FRONTPAGE',
  'PAGE',
  'PRODUCT',
  'SHOP_POLICY',
]);

function hostname(value?: string | null) {
  if (!value) return '';

  try {
    return new URL(value.includes('://') ? value : `https://${value}`).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return value.toLowerCase().replace(/^www\./, '');
  }
}

export function resolveMenuUrl(item: MenuUrlInput, domains: MenuUrlDomains = {}) {
  const rawUrl = item.url?.trim();
  if (!rawUrl) return null;
  if (rawUrl.startsWith('/')) return {href: rawUrl, external: false};

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return {href: rawUrl, external: false};
  }

  const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
  const itemType = item.type?.toUpperCase() ?? '';
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const configuredHosts = [hostname(domains.publicStoreDomain), hostname(domains.primaryDomainUrl)].filter(Boolean);
  const isShopifyHost = host.endsWith('.myshopify.com') || configuredHosts.includes(host);
  const isShopifyResource = shopifyResourceTypes.has(itemType) || shopifyResourcePath.test(parsed.pathname);

  if (isShopifyHost || isShopifyResource) {
    return {href: path || '/', external: false};
  }

  return {href: rawUrl, external: true};
}