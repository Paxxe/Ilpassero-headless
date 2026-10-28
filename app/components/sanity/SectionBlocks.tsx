import {Link} from '~/components/Link';
import {ProductItem} from '~/components/ProductItem';
import type {
  CollectionListSection,
  FaqSection,
  HeroSection,
  ImageWithTextSection,
  ProductRailSection,
  PromoBannerSection,
  RichTextSection,
} from '~/lib/sanity/types';
import {CmsLink, RichText, SanityImg} from './primitives';
import {ProductCarousel} from './ProductCarousel';

export function Hero({section, isFirst}: {section: HeroSection; isFirst: boolean}) {
  const {height = 'large', contentPosition = 'bottom-left', overlayOpacity = 30} = section;
  const Heading = isFirst ? 'h1' : 'h2';
  const loading = isFirst ? 'eager' : 'lazy';

  return (
    <div className={`cms-hero cms-hero--${height} cms-hero--${contentPosition}`}>
      <div className="cms-hero__media">
        {section.mobileImage?.url ? (
          <>
            <SanityImg className="cms-hero__image cms-hero__image--mobile" image={section.mobileImage} loading={loading} />
            <SanityImg className="cms-hero__image cms-hero__image--desktop" image={section.image} loading={loading} />
          </>
        ) : (
          <SanityImg className="cms-hero__image" image={section.image} loading={loading} />
        )}
        <div className="cms-hero__overlay" style={{opacity: overlayOpacity / 100}} />
      </div>
      <div className="cms-hero__content">
        {section.eyebrow ? <p className="cms-eyebrow">{section.eyebrow}</p> : null}
        {section.title ? <Heading className="cms-hero__title">{section.title}</Heading> : null}
        {section.text ? <p className="cms-hero__text">{section.text}</p> : null}
        {section.ctas?.length ? (
          <div className="cms-buttons">
            {section.ctas.map((cta, index) => (
              <CmsLink key={cta?._key ?? index} link={cta} className={index === 0 ? 'cms-button' : 'cms-button cms-button--secondary'} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function RichTextBlock({section}: {section: RichTextSection}) {
  const {alignment = 'center', width = 'narrow'} = section;
  return (
    <div className={`cms-container cms-text cms-text--${alignment} cms-text--${width}`}>
      {section.title ? <h2 className="cms-heading">{section.title}</h2> : null}
      <RichText value={section.content} />
      <CmsLink link={section.cta} className="cms-button" />
    </div>
  );
}

export function ImageWithText({section}: {section: ImageWithTextSection}) {
  return (
    <div className={`cms-container cms-split cms-split--image-${section.imagePosition ?? 'left'}`}>
      <div className="cms-split__media">
        <SanityImg image={section.image} sizes="(min-width: 45em) 50vw, 100vw" />
      </div>
      <div className="cms-split__content">
        {section.eyebrow ? <p className="cms-eyebrow">{section.eyebrow}</p> : null}
        {section.title ? <h2 className="cms-heading">{section.title}</h2> : null}
        <RichText value={section.content} />
        <CmsLink link={section.cta} className="cms-button" />
      </div>
    </div>
  );
}

export function ProductRail({section}: {section: ProductRailSection}) {
  const products = section.products ?? [];
  if (!products.length) return null;

  const header = (arrows?: React.ReactNode) => (
    <header className="cms-section-header">
      {section.title ? <h2 className="cms-heading">{section.title}</h2> : <span />}
      <div className="cms-section-header__actions">
        <CmsLink link={section.cta} className="cms-text-link" />
        {arrows}
      </div>
    </header>
  );

  return (
    <div className="cms-container">
      {section.layout === 'grid' ? (
        <>
          {header()}
          <div className="product-grid">
            {products.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <ProductCarousel products={products} options={section.carousel} header={header} />
      )}
    </div>
  );
}

export function CollectionList({section}: {section: CollectionListSection}) {
  const items = (section.items ?? []).filter((item) => item.handle);
  if (!items.length) return null;

  return (
    <div className="cms-container">
      {section.title ? <h2 className="cms-heading cms-section-header">{section.title}</h2> : null}
      <div className={`cms-collections cms-collections--${section.columns ?? 3}`}>
        {items.map((item) => {
          const label = item.label || item.shopify?.title || item.handle;
          const shopifyImage = item.shopify?.image;
          return (
            <Link key={item._key} className="cms-collection-card" to={`/collections/${item.handle}`} prefetch="intent">
              <div className="cms-collection-card__media">
                {item.image?.url ? (
                  <SanityImg image={item.image} sizes="(min-width: 45em) 33vw, 50vw" maxWidth={1080} />
                ) : shopifyImage ? (
                  <img
                    src={`${shopifyImage.url}${shopifyImage.url.includes('?') ? '&' : '?'}width=900`}
                    alt={shopifyImage.altText ?? ''}
                    loading="lazy"
                  />
                ) : null}
              </div>
              <span className="cms-collection-card__label">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function PromoBanner({section}: {section: PromoBannerSection}) {
  const hasImage = Boolean(section.image?.url);
  return (
    <div className={`cms-promo${hasImage ? ' cms-promo--image' : ''}`}>
      {hasImage ? <SanityImg className="cms-promo__image" image={section.image} /> : null}
      <div className="cms-promo__content">
        {section.title ? <h2 className="cms-heading">{section.title}</h2> : null}
        {section.text ? <p className="cms-promo__text">{section.text}</p> : null}
        <CmsLink link={section.cta} className="cms-button" />
      </div>
    </div>
  );
}

export function Faq({section}: {section: FaqSection}) {
  const items = section.items ?? [];
  if (!items.length) return null;
  return (
    <div className="cms-container cms-text--narrow cms-faq">
      {section.title ? <h2 className="cms-heading">{section.title}</h2> : null}
      {items.map((item) => (
        <details key={item._key} className="cms-faq__item">
          <summary>{item.question}</summary>
          <RichText value={item.answer} />
        </details>
      ))}
    </div>
  );
}
