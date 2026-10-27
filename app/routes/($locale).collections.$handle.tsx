import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {localizePath, toPathPrefix} from '~/lib/i18n';
import {Sections} from '~/components/sanity/Sections';
import {getPreviewTemplateId, getSanity} from '~/lib/sanity.server';
import {RESOURCE_TEMPLATE_QUERY} from '~/lib/sanity/queries';
import {resolveSections} from '~/lib/sanity/sections.server';
import type {MainCollectionSection, TemplateDocument} from '~/lib/sanity/types';

const PRODUCTS_PER_PAGE = 32;

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.collection.title ?? ''} | Il Passero`}];
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
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw redirect(localizePath('/collections', toPathPrefix(storefront.i18n)));
  }

  // The Studio template decides the layout and how many products per page
  const sanity = await getSanity(request, context.env);
  const template = await sanity.fetch<TemplateDocument>(RESOURCE_TEMPLATE_QUERY, {
    type: 'collection',
    handle,
    previewTemplate: getPreviewTemplateId(request, sanity.preview),
  });
  const main = template?.sections?.find(
    (section): section is MainCollectionSection => section._type === 'mainCollectionSection',
  );
  const paginationVariables = getPaginationVariables(request, {
    pageBy: Math.min(Math.max(main?.productsPerPage ?? PRODUCTS_PER_PAGE, 8), 48),
  });

  const [{collection}, sections] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
    template?.sections?.length ? resolveSections(template.sections, storefront) : null,
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    template: template && sections ? {_id: template._id, _type: template._type, sections} : null,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection, template} = useLoaderData<typeof loader>();

  return (
    <>
      {template ? (
        <Sections
          document={template}
          sections={template.sections}
          renderMain={(section) =>
            section._type === 'mainCollectionSection' ? (
              <CollectionMain collection={collection} section={section} />
            ) : null
          }
        />
      ) : (
        <CollectionMain collection={collection} />
      )}
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </>
  );
}

/** Title, description and paginated product grid ("Griglia prodotti collezione"). */
function CollectionMain({
  collection,
  section,
}: {
  collection: Route.ComponentProps['loaderData']['collection'];
  section?: MainCollectionSection;
}) {
  const showTitle = section?.showTitle ?? true;
  const showDescription = section?.showDescription ?? true;

  return (
    <div className="plp">
      {showTitle || (showDescription && collection.description) ? (
        <header className="plp__header">
          {showTitle ? <h1 className="plp__title">{collection.title}</h1> : null}
          {showDescription && collection.description ? (
            <p className="plp__description">{collection.description}</p>
          ) : null}
        </header>
      ) : null}
      <PaginatedResourceSection<ProductCardFragment>
        connection={collection.products}
        resourcesClassName={`product-grid${section?.columnsDesktop === 3 ? ' product-grid--3' : ''}`}
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 4 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
