import type {Storefront} from '@shopify/hydrogen';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import type {CollectionListSection, EditorialCarouselSection, ProductRailSection, Section} from './types';

/**
 * Adds the Shopify data each section needs (product cards, collection
 * images). Sections hidden in the Studio are dropped here.
 */
export async function resolveSections(sections: Section[] | null | undefined, storefront: Storefront) {
  const visible = (sections ?? []).filter((section) => !section.settings?.hidden && !section._placementHidden);

  return Promise.all(
    visible.map(async (section): Promise<Section> => {
      if (section._type === 'productRailSection' || section._type === 'editorialCarouselSection') {
        return resolveProducts(section, storefront);
      }
      if (section._type === 'collectionListSection') return resolveCollectionList(section, storefront);
      return section;
    }),
  );
}

/** Product cards for a section, from its collection or the hand-picked handles. */
async function resolveProducts<T extends ProductRailSection | EditorialCarouselSection>(
  section: T,
  storefront: Storefront,
): Promise<T> {
  if (section.source === 'products') {
    const handles = (section.productHandles ?? []).filter(Boolean).slice(0, 24);
    const results = await Promise.all(
      handles.map((handle) =>
        storefront
          .query(RAIL_PRODUCT_QUERY, {variables: {handle}, cache: storefront.CacheShort()})
          .then((data) => data.product)
          .catch(() => null),
      ),
    );
    return {...section, products: results.filter((product) => product !== null && product !== undefined)};
  }

  if (!section.collectionHandle) return {...section, products: []};
  const data = await storefront
    .query(RAIL_COLLECTION_QUERY, {
      variables: {handle: section.collectionHandle, first: Math.min(Math.max(section.limit ?? 8, 2), 24)},
      cache: storefront.CacheShort(),
    })
    .catch(() => null);
  return {...section, products: data?.collection?.products.nodes ?? []};
}

async function resolveCollectionList(
  section: CollectionListSection,
  storefront: Storefront,
): Promise<CollectionListSection> {
  const items = await Promise.all(
    (section.items ?? []).map(async (item) => {
      if (!item.handle) return {...item, shopify: null};
      const data = await storefront
        .query(COLLECTION_CARD_QUERY, {variables: {handle: item.handle}, cache: storefront.CacheLong()})
        .catch(() => null);
      return {...item, shopify: data?.collection ?? null};
    }),
  );
  return {...section, items};
}

const RAIL_PRODUCT_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query SanityRailProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductCard
    }
  }
` as const;

const RAIL_COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query SanityRailCollection($handle: String!, $first: Int!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;

const COLLECTION_CARD_QUERY = `#graphql
  query SanityCollectionCard($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      title
      image {
        url
        altText
      }
    }
  }
` as const;
