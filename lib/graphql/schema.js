const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')
const typeDefs = require('./type-defs')

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})
