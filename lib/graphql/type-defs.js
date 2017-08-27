module.exports = `
  type Query {
    currentUser: User
  }

  type User {
    id: ID!,
    email: String!
  }
`
