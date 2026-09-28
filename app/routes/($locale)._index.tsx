import {Await, useLoaderData} from 'react-router';
import {Link} from '~/components/Link';
import type {Route} from './+types/($locale)._index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {MockShopNotice} from '~/components/MockShopNotice';
import {SanityPageBuilder, type ResolvedSection} from '~/components/sanity/SanityPageBuilder';
import {getSanityPage, type SanityCarouselSection} from '~/lib/sanity.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}, sanityPage] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    getSanityPage('home', context.env.PUBLIC_SANITY_PROJECT_ID, context.env.PUBLIC_SANITY_DATASET),
  ]);

  const sanitySections: ResolvedSection[] = sanityPage
    ? await Promise.all(sanityPage.sections.map(async (section) => {
        if (section._type === 'collectionCarouselSection') {
          const result = await context.storefront.query(COLLECTION_CAROUSEL_QUERY, {
            variables: {handle: section.collectionHandle || '', first: Math.min(section.limit || 8, 20)},
          });
          return {section, products: result.collection?.products.nodes || []};
        }
        if (section._type === 'productCarouselSection') {
          const products = await Promise.all((section.productHandles || []).map(async (handle) => {
            const result = await context.storefront.query(PRODUCT_BY_HANDLE_QUERY, {variables: {handle}});
            return result.product;
          }));
          return {section, products: products.filter(Boolean)};
        }
        return {section};
      }))
    : [];

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: collections.nodes[0],
    sanityPage,
    sanitySections,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  if (data.sanityPage) {
    return <SanityPageBuilder sections={data.sanitySections} />;
  }

  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image
            data={image}
            sizes="100vw"
            alt={image.altText || collection.title}
          />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section
      className="recommended-products"
      aria-labelledby="recommended-products"
    >
      <h2 id="recommended-products">Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="product-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

const CAROUSEL_PRODUCT_FRAGMENT = `#graphql
  fragment SanityCarouselProduct on Product {
    id
    handle
    title
    featuredImage { url altText width height }
    priceRange { minVariantPrice { amount currencyCode } }
  }
` as const;

const COLLECTION_CAROUSEL_QUERY = `#graphql
  ${CAROUSEL_PRODUCT_FRAGMENT}
  query SanityCollectionCarousel($handle: String!, $first: Int!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: $first) { nodes { ...SanityCarouselProduct } }
    }
  }
` as const;

const PRODUCT_BY_HANDLE_QUERY = `#graphql
  ${CAROUSEL_PRODUCT_FRAGMENT}
  query SanitySelectedProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...SanityCarouselProduct }
  }
` as const;
