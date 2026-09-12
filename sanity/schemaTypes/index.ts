import { type SchemaTypeDefinition } from 'sanity'
import archiveEntry from './archiveEntry'
import planet from './planet'
import species from './species'
import kyberCrystal from './kyberCrystal'
import canonCharacter from './canonCharacter'
import buildType from './buildType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [archiveEntry, planet, species, kyberCrystal, canonCharacter, buildType],
}
