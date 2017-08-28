const faker = require('faker')
const { hashSync } = require('lib/auth/password-service')
const createFactory = require('./create-factory')

module.exports = createFactory({
  email: faker.internet.email,
  passwordHash: () => hashSync(faker.internet.password(), 1)
})
