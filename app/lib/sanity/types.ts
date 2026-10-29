import type {PortableTextBlock} from '@portabletext/react';
import type {ProductCardFragment} from 'storefrontapi.generated';

export type SanityImage = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  hotspot?: {x: number; y: number};
} | null;

export type SanityLink = {_key?: string; label?: string; href?: string | null} | null;

export type SectionSettings = {
  hidden?: boolean;
  colorScheme?: 'light' | 'cream' | 'brand' | 'dark';
  spacingTop?: Spacing;
  spacingBottom?: Spacing;
  anchorId?: string;
} | null;

type Spacing = 'none' | 'small' | 'medium' | 'large';

type SectionBase = {
  _key: string;
  settings?: SectionSettings;
  /** Set when the section comes from a reusable section document. */
  _source?: {id: string; type: string; path: string};
  _placementHidden?: boolean;
};

export type HeroSection = SectionBase & {
  _type: 'heroSection';
  eyebrow?: string;
  title?: string;
  text?: string;
  image?: SanityImage;
  mobileImage?: SanityImage;
  ctas?: SanityLink[] | null;
  height?: 'small' | 'medium' | 'large' | 'full';
  contentPosition?: 'bottom-left' | 'center' | 'bottom-center';
  overlayOpacity?: number;
};

export type RichTextSection = SectionBase & {
  _type: 'richTextSection';
  title?: string;
  content?: PortableTextBlock[];
  cta?: SanityLink;
  alignment?: 'left' | 'center';
  width?: 'narrow' | 'normal';
};

export type ImageWithTextSection = SectionBase & {
  _type: 'imageWithTextSection';
  image?: SanityImage;
  imagePosition?: 'left' | 'right';
  eyebrow?: string;
  title?: string;
  content?: PortableTextBlock[];
  cta?: SanityLink;
};

export type ProductRailSection = SectionBase &
  ProductSource & {
    _type: 'productRailSection';
    title?: string;
    layout?: 'carousel' | 'grid';
    carousel?: CarouselOptions | null;
    cta?: SanityLink;
  };

export type CarouselOptions = {
  slidesDesktop?: number;
  slidesMobile?: number;
  showArrows?: boolean;
  showPagination?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
};

/** Products chosen in the Studio: from a collection or picked by hand. */
type ProductSource = {
  source?: 'collection' | 'products';
  collectionHandle?: string;
  productHandles?: string[] | null;
  limit?: number;
  /** Filled on the server from Shopify. */
  products?: ProductCardFragment[];
};

export type EditorialCarouselSection = SectionBase &
  ProductSource & {
    _type: 'editorialCarouselSection';
    image?: SanityImage;
    imagePosition?: 'left' | 'right';
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    cta?: SanityLink;
    carousel?: CarouselOptions | null;
  };

export type CollectionCard = {
  _key: string;
  label?: string;
  handle?: string;
  image?: SanityImage;
  /** Filled on the server from Shopify. */
  shopify?: {title: string; image?: {url: string; altText?: string | null} | null} | null;
};

export type CollectionListSection = SectionBase & {
  _type: 'collectionListSection';
  title?: string;
  columns?: 2 | 3 | 4;
  items?: CollectionCard[] | null;
};

export type PromoBannerSection = SectionBase & {
  _type: 'promoBannerSection';
  title?: string;
  text?: string;
  image?: SanityImage;
  cta?: SanityLink;
};

export type FaqSection = SectionBase & {
  _type: 'faqSection';
  title?: string;
  items?: Array<{_key: string; question?: string; answer?: PortableTextBlock[]}> | null;
};

export type MainCollectionSection = SectionBase & {
  _type: 'mainCollectionSection';
  showTitle?: boolean;
  showDescription?: boolean;
  productsPerPage?: number;
  columnsDesktop?: 3 | 4;
};

export type MainProductSection = SectionBase & {
  _type: 'mainProductSection';
  galleryLayout?: 'grid' | 'carousel';
  showVendor?: boolean;
  showDescription?: boolean;
};

export type Section =
  | HeroSection
  | RichTextSection
  | ImageWithTextSection
  | ProductRailSection
  | EditorialCarouselSection
  | CollectionListSection
  | PromoBannerSection
  | FaqSection
  | MainCollectionSection
  | MainProductSection;

export type MainSection = MainCollectionSection | MainProductSection;

export type SanitySeo = {title?: string; description?: string; noIndex?: boolean; image?: string} | null;

/** A document that owns a list of sections (home, page, template). */
export type SectionsDocument = {
  _id: string;
  _type: string;
  sections?: Section[] | null;
};

export type HomeDocument = SectionsDocument & {seo?: SanitySeo};

export type PageDocument = SectionsDocument & {
  title?: string;
  layout?: 'template' | 'custom';
  seo?: SanitySeo;
  template?: (SectionsDocument & {name?: string}) | null;
};

export type TemplateDocument = SectionsDocument & {name?: string};

export type SiteSettings = {
  _id: string;
  _type: string;
  logo?: {url?: string; width?: number; height?: number} | null;
  /** Inline <svg> code pasted in the Studio (takes precedence over the file). */
  logoSvg?: string | null;
  logoWidth?: number | null;
  logoAlt?: string | null;
};
