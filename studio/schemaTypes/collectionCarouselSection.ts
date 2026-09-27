import {defineField, defineType} from 'sanity';

export const collectionCarouselSection = defineType({
  name: 'collectionCarouselSection',
  title: 'Shopify collection carousel',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Section title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'collectionHandle', title: 'Shopify collection handle', type: 'string', description: 'Handle from the Shopify collection URL, without /collections/.' , validation: (rule) => rule.required()}),
    defineField({name: 'limit', title: 'Products to show', type: 'number', initialValue: 8, validation: (rule) => rule.min(2).max(20)}),
  ],
  preview: {select: {title: 'title', subtitle: 'collectionHandle'}},
});