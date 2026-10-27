import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {Sections} from '~/components/sanity/Sections';
import {getPreviewTemplateId, getSanity} from '~/lib/sanity.server';
import {RESOURCE_TEMPLATE_QUERY} from '~/lib/sanity/queries';
import {resolveSections} from '~/lib/sanity/sections.server';
import type {MainProductSection, TemplateDocument} from '~/lib/sanity/types';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `${data?.product.title ?? ''} | Il Passero`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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
    throw new Error('Expected product handle to be defined');
  }

  const sanity = await getSanity(request, context.env);
  const [{product}, template] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    sanity.fetch<TemplateDocument>(RESOURCE_TEMPLATE_QUERY, {
      type: 'product',
      handle,
      previewTemplate: getPreviewTemplateId(request, sanity.preview),
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  const sections = template?.sections?.length ? await resolveSections(template.sections, storefront) : null;

  return {
    product,
    template: template && sections ? {_id: template._id, _type: template._type, sections} : null,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product, template} = useLoaderData<typeof loader>();

  if (!template) return <ProductMain product={product} />;

  return (
    <Sections
      document={template}
      sections={template.sections}
      renderMain={(section) =>
        section._type === 'mainProductSection' ? <ProductMain product={product} section={section} /> : null
      }
    />
  );
}

/** Gallery, price, variant picker and add to cart ("Scheda prodotto"). */
function ProductMain({
  product,
  section,
}: {
  product: Route.ComponentProps['loaderData']['product'];
  section?: MainProductSection;
}) {
  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;
  const showDescription = section?.showDescription ?? true;

  // Selected variant image first, then the rest of the product gallery
  const gallery = [
    ...(selectedVariant?.image ? [selectedVariant.image] : []),
    ...product.images.nodes.filter((image) => image.id !== selectedVariant?.image?.id),
  ];

  return (
    <div className="product">
      {section ? (
        <div className={`product-gallery product-gallery--${section.galleryLayout ?? 'grid'}`}>
          {gallery.map((image, index) => (
            <ProductImage key={image.id ?? index} image={image} />
          ))}
        </div>
      ) : (
        <ProductImage image={selectedVariant?.image} />
      )}
      <div className="product-main">
        {section?.showVendor && vendor ? <p className="cms-eyebrow">{vendor}</p> : null}
        <h1>{title}</h1>
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />
        <br />
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />
        {showDescription ? (
          <>
            <br />
            <br />
            <p>
              <strong>Descrizione</strong>
            </p>
            <br />
            <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
            <br />
          </>
        ) : null}
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 12) {
      nodes {
        __typename
        id
        url
        altText
        width
        height
      }
    }
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
