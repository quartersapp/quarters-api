const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')
const typeDefs = require('./type-defs')
const log = require('lib/logger')

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: { log: log.info }
})
