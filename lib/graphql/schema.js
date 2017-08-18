const { makeExecutableSchema } = require('graphql-tools')

const typeDefs = `
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello world'
  }
}

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})
