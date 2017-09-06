const { readFileSync } = require('fs')
const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')
const { log } = require('lib/logger/index')

const logger = {
  log: (err, ok) => log.error(err)
}

// must be relative to root directory so it
// can resolve from index.js build
const PATH_TO_SCHEMA = 'lib/graphql/schema.graphql'

module.exports = makeExecutableSchema({
  typeDefs: readFileSync(PATH_TO_SCHEMA, 'utf8'),
  resolvers,
  logger
})
