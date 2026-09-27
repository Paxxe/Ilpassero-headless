import {defineArrayMember, defineField, defineType} from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Page composer', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Page title', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', group: 'content', options: {source: 'title', maxLength: 96}, validation: (rule) => rule.required()}),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'heroSection'}),
        defineArrayMember({type: 'collectionCarouselSection'}),
        defineArrayMember({type: 'productCarouselSection'}),
      ],
      options: {insertMenu: {views: [{name: 'grid'}]}},
      validation: (rule) => rule.min(1),
    }),
    defineField({name: 'metaTitle', title: 'Meta title', type: 'string', group: 'seo'}),
    defineField({name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, group: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
});