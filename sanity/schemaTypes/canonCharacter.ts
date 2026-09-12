import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'canonCharacter',
  title: 'Canon Character',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'forcePower', title: 'Force Power (0-100)', type: 'number'}),
    defineField({name: 'alignment', title: 'Alignment (-100 dark to +100 light)', type: 'number'}),
    defineField({name: 'saberSkill', title: 'Saber Skill (0-100)', type: 'number'}),
    defineField({name: 'agility', title: 'Agility (0-100)', type: 'number'}),
    defineField({name: 'wisdom', title: 'Wisdom (0-100)', type: 'number'}),
    defineField({name: 'resilience', title: 'Resilience (0-100)', type: 'number'}),
  ],
})
