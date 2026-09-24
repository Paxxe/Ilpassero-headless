export type StoryblokBlock = {
  _uid: string;
  _editable?: string;
  component: string;
  [key: string]: unknown;
};

export type StoryblokStory = {
  content: StoryblokBlock;
};

export async function getStoryblokStory(
  slug: string,
  accessToken: string | undefined,
  version = 'draft',
): Promise<StoryblokStory | null> {
  if (!accessToken) return null;

  const response = await fetch(`https://api.storyblok.com/v2/cdn/stories/${slug}?version=${version}&token=${accessToken}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Storyblok request failed: ${response.status}`);

  const payload = (await response.json()) as { story?: StoryblokStory };
  return payload.story ?? null;
}