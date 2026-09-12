import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'archiveEntry',
  title: 'Archive Entry',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (Rule) => Rule.required()}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Character', value: 'character'},
          {title: 'Planet', value: 'planet'},
          {title: 'Species', value: 'species'},
          {title: 'Faction / Organization', value: 'faction'},
          {title: 'Vehicle / Ship', value: 'vehicle'},
          {title: 'Technology / Artifact', value: 'technology'},
          {title: 'Event', value: 'event'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'era',
      title: 'Era',
      type: 'string',
      options: {list: ['The Old Republic', 'The High Republic', 'Prequel Era', 'Original Trilogy', 'New Republic', 'Sequel Era']},
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Full Entry', type: 'array', of: [{type: 'block'}]}),
  ],
  preview: {select: {title: 'title', subtitle: 'category', media: 'image'}},
})