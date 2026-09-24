import {storyblokEditable} from '@storyblok/react';
import type {StoryblokBlock} from '~/lib/storyblok.server';

export function Hero({blok}: {blok: StoryblokBlock}) {
  const image = blok.Img as string | undefined;
  const link = blok.Link as {url?: string; cached_url?: string} | undefined;
  const linkUrl = link?.url || link?.cached_url;
  return (
    <section className="storyblok-hero" {...storyblokEditable(blok)}>
      {image ? <img src={`https:${image}`} alt="" /> : null}
      <div>
        <p>Il Passero</p>
        <h1>{String(blok.Title ?? '')}</h1>
        {blok.Subtitle ? <p>{String(blok.Subtitle)}</p> : null}
        {blok.Cta_label && linkUrl ? <a href={linkUrl}>{String(blok.Cta_label)}</a> : null}
      </div>
    </section>
  );
}