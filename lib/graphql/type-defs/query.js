const User = require('./user')

const Query = `
  type Query {
    currentUser: User
  }
`

module.exports = () => [Query, User]
