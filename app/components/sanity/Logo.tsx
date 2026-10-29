import {useRouteLoaderData} from 'react-router';
import {createDataAttribute} from '@sanity/visual-editing/create-data-attribute';
import type {RootLoader} from '~/root';
import type {SiteSettings} from '~/lib/sanity/types';

/**
 * Strips anything executable from SVG code pasted in the Studio. The Studio
 * already rejects it; this is a second safety net before inlining.
 */
function sanitizeSvg(code: string) {
  return code
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|xlink:href)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '');
}

/** Site logo from "Impostazioni sito": inline SVG code, else the uploaded file, else the shop name. */
export function Logo({settings, fallback}: {settings?: SiteSettings | null; fallback: string}) {
  const root = useRouteLoaderData<RootLoader>('root');
  const alt = settings?.logoAlt || fallback;
  const width = settings?.logoWidth ?? 140;
  const svg = settings?.logoSvg?.trim();
  const file = settings?.logo?.url;

  // In the visual composer, clicking the logo opens "Impostazioni sito"
  const dataSanity =
    root?.sanityPreview && settings
      ? createDataAttribute({baseUrl: root.sanityStudioUrl, id: settings._id, type: settings._type, path: 'logo'}).toString()
      : undefined;
  const style = {'--logo-width': `${width}px`} as React.CSSProperties;

  if (svg) {
    return (
      <span
        className="logo logo--svg"
        role="img"
        aria-label={alt}
        style={style}
        data-sanity={dataSanity}
        dangerouslySetInnerHTML={{__html: sanitizeSvg(svg)}}
      />
    );
  }
  if (file) {
    return (
      <img
        className="logo"
        src={file}
        alt={alt}
        width={settings?.logo?.width}
        height={settings?.logo?.height}
        style={style}
        data-sanity={dataSanity}
      />
    );
  }
  return (
    <strong className="logo logo--text" data-sanity={dataSanity}>
      {fallback}
    </strong>
  );
}
