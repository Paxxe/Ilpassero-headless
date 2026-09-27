import {createClient} from '@sanity/client';

export type SanityHeroSection = {
  _key: string;
  _type: 'heroSection';
  eyebrow?: string;
  title: string;
  body?: Array<Record<string, unknown>>;
  image?: {asset?: {url?: string}; imageAlt?: string};
  ctaLabel?: string;
  ctaUrl?: string;
  theme?: 'light' | 'dark';
};

export type SanityCarouselSection = {
  _key: string;
  _type: 'collectionCarouselSection' | 'productCarouselSection';
  title: string;
  collectionHandle?: string;
  productHandles?: string[];
  limit?: number;
};

export type SanityPage = {
  _id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  sections: Array<SanityHeroSection | SanityCarouselSection>;
};

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  metaTitle,
  metaDescription,
  sections[]{
    _key,
    _type,
    eyebrow,
    title,
    body,
    image {imageAlt, asset->{url}},
    ctaLabel,
    ctaUrl,
    theme,
    collectionHandle,
    productHandles,
    limit
  }
}`;

export async function getSanityPage(
  slug: string,
  projectId?: string,
  dataset = 'production',
) {
  if (!projectId) return null;

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2026-07-01',
    useCdn: true,
  });

  return client.fetch<SanityPage | null>(PAGE_QUERY, {slug});
}