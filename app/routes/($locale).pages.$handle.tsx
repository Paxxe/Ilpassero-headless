import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).pages.$handle';
import {stegaClean} from '@sanity/client/stega';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {Sections} from '~/components/sanity/Sections';
import {getPreviewTemplateId, getSanity} from '~/lib/sanity.server';
import {PAGE_QUERY} from '~/lib/sanity/queries';
import {resolveSections} from '~/lib/sanity/sections.server';
import type {PageDocument} from '~/lib/sanity/types';

export const meta: Route.MetaFunction = ({data}) => {
  if (data?.cms) {
    const {title, seo} = stegaClean(data.cms.page);
    return [
      {title: `${seo?.title || title || ''} | Il Passero`},
      ...(seo?.description ? [{name: 'description', content: seo.description}] : []),
      ...(seo?.noIndex ? [{name: 'robots', content: 'noindex'}] : []),
    ];
  }
  return [{title: `${data?.page?.title ?? ''} | Il Passero`}];
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
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const sanity = await getSanity(request, context.env);
  const previewTemplate = getPreviewTemplateId(request, sanity.preview);
  const [{page}, cmsPage] = await Promise.all([
    context.storefront.query(SHOPIFY_PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    sanity.fetch<PageDocument>(PAGE_QUERY, {slug: params.handle, previewTemplate}),
  ]);

  // A page composed in the Studio wins over the Shopify page with the same handle
  if (cmsPage) {
    const useTemplate = cmsPage.layout === 'template' || Boolean(previewTemplate);
    const owner = useTemplate && cmsPage.template ? cmsPage.template : cmsPage;
    return {
      page: null,
      cms: {
        page: cmsPage,
        owner: {_id: owner._id, _type: owner._type},
        sections: await resolveSections(owner.sections, context.storefront),
      },
    };
  }

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
    cms: null,
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

export default function Page() {
  const {page, cms} = useLoaderData<typeof loader>();

  if (cms) {
    return <Sections document={cms.owner} sections={cms.sections} />;
  }
  if (!page) return null;

  return (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </div>
  );
}

const SHOPIFY_PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
