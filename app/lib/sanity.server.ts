import {createClient, type SanityClient} from '@sanity/client';
import {createCookie} from 'react-router';

const API_VERSION = '2026-07-01';
const DEFAULT_STUDIO_URL = 'http://localhost:3333';

/**
 * Fields used as data (handles, URLs, enums, anchors) that must never receive
 * the invisible stega characters used for click-to-edit overlays.
 */
const STEGA_SKIP_FIELDS = new Set([
  'slug',
  'handle',
  'href',
  'url',
  'linkType',
  'source',
  'layout',
  'height',
  'contentPosition',
  'imagePosition',
  'alignment',
  'width',
  'colorScheme',
  'spacingTop',
  'spacingBottom',
  'anchorId',
  'galleryLayout',
  'templateType',
  'logoSvg',
]);

export function getStudioUrl(env: Env) {
  return env.PUBLIC_SANITY_STUDIO_URL || DEFAULT_STUDIO_URL;
}

/**
 * Preview (draft mode) flag. It lives in its own cookie instead of the app
 * session because the Studio embeds the storefront in a cross-site iframe,
 * which requires SameSite=None.
 */
export function getPreviewCookie(env: Env) {
  return createCookie('__sanity_preview', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    secrets: [env.SESSION_SECRET],
  });
}

export async function isSanityPreview(request: Request, env: Env) {
  if (!env.SANITY_API_READ_TOKEN) return false;
  const value = await getPreviewCookie(env).parse(request.headers.get('Cookie'));
  return value === true;
}

const skipStega = (path: readonly unknown[]) =>
  path.some((segment) => typeof segment === 'string' && STEGA_SKIP_FIELDS.has(segment));

export function createSanityClient(env: Env, {preview = false} = {}): SanityClient | null {
  if (!env.PUBLIC_SANITY_PROJECT_ID) return null;

  const client = createClient({
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: API_VERSION,
    useCdn: true,
  });

  if (!preview || !env.SANITY_API_READ_TOKEN) return client;

  return client.withConfig({
    useCdn: false,
    token: env.SANITY_API_READ_TOKEN,
    perspective: 'drafts',
    stega: {
      enabled: true,
      studioUrl: getStudioUrl(env),
      filter: (props) =>
        skipStega(props.sourcePath) || skipStega(props.resultPath) ? false : props.filterDefault(props),
    },
  });
}

/**
 * Sanity access for a request: the client (drafts + stega in preview mode)
 * and a `fetch` that never throws, so a CMS outage falls back to the default layout.
 */
export async function getSanity(request: Request, env: Env) {
  const preview = await isSanityPreview(request, env);
  const client = createSanityClient(env, {preview});

  async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
    if (!client) return null;
    try {
      return await client.fetch<T>(query, params);
    } catch (error) {
      console.error('Sanity query failed', error);
      return null;
    }
  }

  return {preview, fetch: fetchSanity};
}

/** Template id requested by the Studio ("Anteprima su"): honoured only in preview mode. */
export function getPreviewTemplateId(request: Request, preview: boolean) {
  if (!preview) return null;
  const id = new URL(request.url).searchParams.get('previewTemplate');
  return id ? id.replace(/^drafts\./, '') : null;
}
