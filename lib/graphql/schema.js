const { makeExecutableSchema } = require('graphql-tools')
const { User } = require('lib/db/models')

const typeDefs = `
  type Query {
    currentUser: User
  }

  type User {
    id: Int!,
    email: String!
  }
`

const resolvers = {
  Query: {
    currentUser: async (obj, args, context, info) => {
      if (!context.userId) return null
      return User.query().findById(context.userId)
    }
  }
}

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})
