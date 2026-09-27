import {defineField, defineType} from 'sanity';

export const productCarouselSection = defineType({
  name: 'productCarouselSection',
  title: 'Selected Shopify products carousel',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Section title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'productHandles',
      title: 'Shopify product handles',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Add product handles in the order they should appear.',
      validation: (rule) => rule.required().min(1).max(12),
    }),
  ],
  preview: {select: {title: 'title', handles: 'productHandles'}, prepare: ({title, handles}) => ({title, subtitle: handles?.join(', ')})},
});