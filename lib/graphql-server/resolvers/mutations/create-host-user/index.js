const {
  combineValidators,
  composeValidators,
  isRequired,
  hasLengthBetween
} = require('revalidate')
const { isEmail } = require('./validators')
const { User } = require('lib/db/models')
const validateArgs = require('lib/graphql-server/validate-args')
const { createError } = require('apollo-errors')

const ExistingUserError = createError('ExistingUserError', {
  message: 'A user with that email already exists'
})

const validator = combineValidators({
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
})

module.exports = async (obj, args, ctx, info) => {
  const {
    input: {
      firstName,
      lastName,
      email,
      password
    }
  } = args

  validateArgs(args, validator)

  if (await User.query().first().where({ email })) {
    throw new ExistingUserError('A user with that email already exists')
  }

  const user = await User.query().insert({
    firstName,
    lastName,
    email,
    password
  }).returning('*')

  return { user }
}
