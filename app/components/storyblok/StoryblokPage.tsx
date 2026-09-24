import {Hero} from './Hero';
import {TextBlock} from './TextBlock';
import type {StoryblokBlock} from '~/lib/storyblok.server';

export function StoryblokPage({blocks}: {blocks: StoryblokBlock[]}) {
  return (
    <main>
      {blocks.map((block) => {
        if (block.component === 'hero') return <Hero key={block._uid} blok={block} />;
        if (block.component === 'text_block') return <TextBlock key={block._uid} blok={block} />;
        return null;
      })}
    </main>
  );
}