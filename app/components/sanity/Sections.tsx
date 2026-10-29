import {useRouteLoaderData} from 'react-router';
import {createDataAttribute} from '@sanity/visual-editing/create-data-attribute';
import type {RootLoader} from '~/root';
import type {MainSection, Section, SectionsDocument} from '~/lib/sanity/types';
import {
  CollectionList,
  EditorialCarousel,
  Faq,
  Hero,
  ImageWithText,
  ProductRail,
  PromoBanner,
  RichTextBlock,
} from './SectionBlocks';

type SectionsProps = {
  /** Document that owns the sections: used to point click-to-edit at the right place. */
  document: Pick<SectionsDocument, '_id' | '_type'>;
  sections: Section[];
  /** Renders the Shopify "main" section (PLP grid / PDP) of a template. */
  renderMain?: (section: MainSection) => React.ReactNode;
};

/** Renders a list of Studio sections, like a Shopify theme template. */
export function Sections({document, sections, renderMain}: SectionsProps) {
  const root = useRouteLoaderData<RootLoader>('root');
  const studioUrl = root?.sanityPreview ? root.sanityStudioUrl : undefined;

  return (
    <div className="cms-sections">
      {sections.map((section, index) => {
        const content =
          section._type === 'mainCollectionSection' || section._type === 'mainProductSection'
            ? renderMain?.(section)
            : renderSection(section, index === 0);
        if (!content) return null;

        const settings = section.settings;
        const source = section._source;
        // In the visual composer, clicking a section opens it in the Studio (and allows drag & drop)
        const dataSanity = studioUrl
          ? createDataAttribute({
              baseUrl: studioUrl,
              id: source?.id ?? document._id,
              type: source?.type ?? document._type,
              path: source?.path ?? `sections[_key=="${section._key}"]`,
            }).toString()
          : undefined;

        return (
          <section
            key={section._key}
            id={settings?.anchorId || undefined}
            data-sanity={dataSanity}
            className={[
              'cms-section',
              `cms-section--${section._type}`,
              `cms-scheme--${settings?.colorScheme ?? 'light'}`,
              `cms-pt--${settings?.spacingTop ?? 'medium'}`,
              `cms-pb--${settings?.spacingBottom ?? 'medium'}`,
            ].join(' ')}
          >
            {content}
          </section>
        );
      })}
    </div>
  );
}

function renderSection(section: Section, isFirst: boolean) {
  switch (section._type) {
    case 'heroSection':
      return <Hero section={section} isFirst={isFirst} />;
    case 'richTextSection':
      return <RichTextBlock section={section} />;
    case 'imageWithTextSection':
      return <ImageWithText section={section} />;
    case 'productRailSection':
      return <ProductRail section={section} />;
    case 'editorialCarouselSection':
      return <EditorialCarousel section={section} />;
    case 'collectionListSection':
      return <CollectionList section={section} />;
    case 'promoBannerSection':
      return <PromoBanner section={section} />;
    case 'faqSection':
      return <Faq section={section} />;
    default:
      return null;
  }
}
