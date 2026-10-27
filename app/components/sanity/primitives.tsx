import {PortableText, type PortableTextComponents, type PortableTextBlock} from '@portabletext/react';
import {Link} from '~/components/Link';
import type {SanityImage, SanityLink} from '~/lib/sanity/types';

const WIDTHS = [480, 768, 1080, 1440, 1920, 2560];

function imageSrc(url: string, width: number) {
  return `${url}?w=${width}&auto=format&fit=max&q=80`;
}

/** Image from the Sanity CDN, responsive, cropped around the hotspot chosen in the Studio. */
export function SanityImg({
  image,
  sizes = '100vw',
  className,
  loading = 'lazy',
  maxWidth = 2560,
}: {
  image?: SanityImage;
  sizes?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  maxWidth?: number;
}) {
  if (!image?.url) return null;
  const url = image.url;
  const widths = WIDTHS.filter((width) => width <= maxWidth);

  return (
    <img
      className={className}
      src={imageSrc(url, widths.at(-1) ?? maxWidth)}
      srcSet={widths.map((width) => `${imageSrc(url, width)} ${width}w`).join(', ')}
      sizes={sizes}
      alt={image.alt ?? ''}
      width={image.width}
      height={image.height}
      loading={loading}
      style={image.hotspot ? {objectPosition: `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`} : undefined}
    />
  );
}

/** Link from the Studio: internal paths keep the locale prefix, external ones open normally. */
export function CmsLink({
  link,
  className,
  children,
}: {
  link?: SanityLink;
  className?: string;
  children?: React.ReactNode;
}) {
  const href = link?.href;
  const content = children ?? link?.label;
  if (!href || !content) return null;

  if (href.startsWith('/')) {
    return (
      <Link className={className} to={href} prefetch="intent">
        {content}
      </Link>
    );
  }
  const isWeb = /^https?:/.test(href);
  return (
    <a className={className} href={href} {...(isWeb ? {target: '_blank', rel: 'noreferrer'} : {})}>
      {content}
    </a>
  );
}

const components: PortableTextComponents = {
  marks: {
    link: ({value, children}) => <CmsLink link={value as SanityLink}>{children}</CmsLink>,
  },
};

export function RichText({value, className}: {value?: PortableTextBlock[] | null; className?: string}) {
  if (!value?.length) return null;
  return (
    <div className={className ? `cms-rich-text ${className}` : 'cms-rich-text'}>
      <PortableText value={value} components={components} />
    </div>
  );
}
