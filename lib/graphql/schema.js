const { readFileSync } = require('fs')
const { resolve } = require('path')
const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')
const log = require('lib/logger')

module.exports = makeExecutableSchema({
  typeDefs: readFileSync(resolve(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  logger: { log: log.info }
})
