import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'kyberCrystal',
  title: 'Kyber Crystal',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'color', title: 'Color', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'forceModifier', title: 'Force Power Modifier', type: 'number', initialValue: 0}),
    defineField({name: 'alignmentModifier', title: 'Alignment Modifier', type: 'number', initialValue: 0}),
    defineField({name: 'saberModifier', title: 'Saber Skill Modifier', type: 'number', initialValue: 0}),
    defineField({name: 'notableCharacters', title: 'Notable Wielders', type: 'array', of: [{type: 'string'}], description: 'Famous characters who wielded this crystal color'}),
    defineField({name: 'keyEvents', title: 'Key Events / Battles', type: 'array', of: [{type: 'string'}], description: 'Notable battles or duels associated with this crystal color'}),
    defineField({name: 'appearances', title: 'Appearances', type: 'array', of: [{type: 'string'}], description: 'Films or shows where this crystal color is significant'}),
    defineField({name: 'trivia', title: 'Trivia', type: 'text', rows: 2}),
  ],
})
