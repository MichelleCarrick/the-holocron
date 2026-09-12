import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'species',
  title: 'Species',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'forceModifier', title: 'Force Power Modifier', type: 'number', initialValue: 0}),
    defineField({name: 'alignmentModifier', title: 'Alignment Modifier', type: 'number', initialValue: 0}),
    defineField({name: 'saberModifier', title: 'Saber Skill Modifier', type: 'number', initialValue: 0}),
    defineField({name: 'agilityModifier', title: 'Agility Modifier', type: 'number', initialValue: 0}),
    defineField({name: 'wisdomModifier', title: 'Wisdom Modifier', type: 'number', initialValue: 0}),
    defineField({name: 'resilienceModifier', title: 'Resilience Modifier', type: 'number', initialValue: 0}),
    defineField({name: 'nameFragments', title: 'Name Fragments', type: 'array', of: [{type: 'string'}], description: 'Syllables used to help generate character names'}),
    defineField({name: 'notableCharacters', title: 'Notable Characters', type: 'array', of: [{type: 'string'}], description: 'Famous characters of this species'}),
    defineField({name: 'keyEvents', title: 'Key Events / Battles', type: 'array', of: [{type: 'string'}], description: 'Notable battles or events involving this species'}),
    defineField({name: 'appearances', title: 'Appearances', type: 'array', of: [{type: 'string'}], description: 'Films or shows where this species is significant'}),
    defineField({name: 'trivia', title: 'Trivia', type: 'text', rows: 2}),
  ],
})
