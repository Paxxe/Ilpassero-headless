import {HeroBanner} from './HeroBanner';
import {ProductRail, type RailProduct} from './ProductRail';
import type {SanityCarouselSection, SanityHeroSection, SanityPage} from '~/lib/sanity.server';

export type ResolvedSection = {
  section: SanityPage['sections'][number];
  products?: RailProduct[];
};

export function SanityPageBuilder({sections}: {sections: ResolvedSection[]}) {
  return (
    <div className="sanity-page-builder">
      {sections.map(({section, products}) => {
        if (section._type === 'heroSection') return <HeroBanner key={section._key} section={section as SanityHeroSection} />;
        if (section._type === 'collectionCarouselSection' || section._type === 'productCarouselSection') {
          return <ProductRail key={section._key} title={(section as SanityCarouselSection).title} products={products || []} />;
        }
        return null;
      })}
    </div>
  );
}