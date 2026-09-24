import {storyblokEditable} from '@storyblok/react';
import {renderRichText, type StoryblokRichTextInput} from '@storyblok/richtext';
import type {StoryblokBlock} from '~/lib/storyblok.server';

export function TextBlock({blok}: {blok: StoryblokBlock}) {
  const title = blok.Title as StoryblokRichTextInput | undefined;
  return (
    <section className="storyblok-text" {...storyblokEditable(blok)}>
      {title ? <div dangerouslySetInnerHTML={{__html: renderRichText(title)}} /> : null}
      {blok.Text ? <p>{String(blok.Text)}</p> : null}
    </section>
  );
}