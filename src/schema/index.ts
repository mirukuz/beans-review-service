import { builder } from '../builder'
import './user'
import './review'
import './roaster'
import './bean'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { printSchema } from 'graphql'

export const schema = builder.toSchema({})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

writeFileSync(resolve(__dirname, '../../schema.graphql'), printSchema(schema))
