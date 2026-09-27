import {defineField, defineType} from 'sanity';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero banner',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'body', title: 'Text', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}, validation: (rule) => rule.required()}),
    defineField({name: 'imageAlt', title: 'Image alt text', type: 'string'}),
    defineField({name: 'ctaLabel', title: 'Button label', type: 'string'}),
    defineField({name: 'ctaUrl', title: 'Button URL', type: 'url'}),
    defineField({name: 'theme', title: 'Text color', type: 'string', options: {list: [{title: 'Light', value: 'light'}, {title: 'Dark', value: 'dark'}], layout: 'radio'}, initialValue: 'light'}),
  ],
  preview: {select: {title: 'title', media: 'image'}},
});