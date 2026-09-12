import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'buildType',
  title: 'Build Type',
  type: 'document',
  fields: [
    defineField({name: 'key', title: 'Key (do not change once set)', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'name', title: 'Display Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
  ],
})
