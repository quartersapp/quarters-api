const { internet, name } = require('faker')
const { hashSync } = require('lib/services/password-service')
const createFactory = require('./create-factory')

module.exports = createFactory({
  email: internet.email,
  passwordHash: () => hashSync(internet.password(), 1),
  firstName: name.firstName,
  lastName: name.lastName
})
