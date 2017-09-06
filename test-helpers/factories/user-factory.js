const { internet, name } = require('faker')
const { hashSync } = require('lib/auth/password-service')
const createFactory = require('./create-factory')

module.exports = createFactory({
  email: internet.email,
  passwordHash: () => hashSync(internet.password(), 1),
  firstName: name.firstName,
  lastName: name.lastName
})
