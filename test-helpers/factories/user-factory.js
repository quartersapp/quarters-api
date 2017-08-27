const { memoize } = require('lodash')
const faker = require('faker')
const passwordService = require('lib/auth/password-service')
const createFactory = require('./create-factory')

const hash = memoize(passwordService.hash)

module.exports = createFactory({
  email: faker.internet.email,
  passwordHash: () => hash('password')
})
