const { readFileSync } = require('fs')
const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

// must be relative to root directory so it
// can resolve from index.js build
const PATH_TO_SCHEMA = 'lib/graphql-server/schema.graphql'

module.exports = makeExecutableSchema({
  typeDefs: readFileSync(PATH_TO_SCHEMA, 'utf8'),
  resolvers
})
