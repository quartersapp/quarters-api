const {
  combineValidators,
  composeValidators,
  isRequired,
  hasLengthBetween
} = require('revalidate')
const { compose } = require('lodash/fp')
const { isEmail } = require('./validators')
const { User } = require('lib/db/models')
const { createError } = require('apollo-errors')
const argValidator = require('lib/graphql-server/resolvers/middleware/arg-validator')

const ExistingUserError = createError('ExistingUserError', {
  message: 'A user with that email already exists'
})

module.exports = compose([
  argValidator(combineValidators({
    input: {
      firstName: composeValidators(
        isRequired,
        hasLengthBetween(1, 50)
      )('First name'),
      lastName: composeValidators(
        isRequired,
        hasLengthBetween(1, 50)
      )('Last name'),
      email: composeValidators(
        isRequired,
        isEmail
      )('Email'),
      password: composeValidators(
        isRequired,
        hasLengthBetween(6, 72)
      )('Password')
    }
  }))
])(async function createHostUser (obj, args, ctx, info) {
  const {
    input: {
      firstName,
      lastName,
      email,
      password
    }
  } = args

  if (await User.findByEmail(email)) {
    throw new ExistingUserError('A user with that email already exists')
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password
  })

  return { user }
})
