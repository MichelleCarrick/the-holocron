import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'quizQuestion',
  title: 'Quiz Question',
  type: 'document',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'options',
      title: 'Answer Options',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(2).max(6),
    }),
    defineField({
      name: 'correctAnswer',
      title: 'Correct Answer',
      type: 'string',
      description: 'Must exactly match one of the answer options above',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'explanation',
      title: 'Explanation',
      type: 'text',
      rows: 2,
      description: 'Shown after answering, win or lose',
    }),
    defineField({
      name: 'era',
      title: 'Era',
      type: 'string',
      options: {list: ['The Old Republic', 'The High Republic', 'Prequel Era', 'Original Trilogy', 'New Republic', 'Sequel Era']},
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {list: ['Youngling', 'Padawan', 'Jedi Master'], layout: 'radio'},
      initialValue: 'Padawan',
    }),
  ],
  preview: {select: {title: 'question', subtitle: 'difficulty'}},
})
