import {PortableText} from '@portabletext/react';
import type {SanityHeroSection} from '~/lib/sanity.server';

export function HeroBanner({section}: {section: SanityHeroSection}) {
  return (
    <section className={`sanity-hero sanity-hero--${section.theme || 'light'}`}>
      {section.image?.asset?.url ? (
        <img className="sanity-hero__image" src={section.image.asset.url} alt={section.image.imageAlt || ''} />
      ) : null}
      <div className="sanity-hero__shade" />
      <div className="sanity-hero__content">
        {section.eyebrow ? <p className="sanity-hero__eyebrow">{section.eyebrow}</p> : null}
        <h1>{section.title}</h1>
        {section.body?.length ? <div className="sanity-hero__body"><PortableText value={section.body as never} /></div> : null}
        {section.ctaLabel && section.ctaUrl ? <a className="sanity-hero__cta" href={section.ctaUrl}>{section.ctaLabel}</a> : null}
      </div>
    </section>
  );
}