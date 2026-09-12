import { type SchemaTypeDefinition } from 'sanity'
import archiveEntry from './archiveEntry'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [archiveEntry],
}