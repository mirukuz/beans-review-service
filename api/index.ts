import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'
import { schema } from './schema/index'

const yoga = createYoga({
  graphqlEndpoint: '/api',
  landingPage: false,
  schema,
  context: (req) => {
    return {
      req,
    }
  },
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.log(`\
🚀 Server ready at: http://127.0.0.1:4000/api
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})
