const {
  combineValidators,
  isRequired,
  hasLengthBetween
} = require('revalidate')
const { isEmail } = require('lib/graphql-server/resolvers/validators')
const { User } = require('lib/db/models')
const { createError } = require('apollo-errors')
const applyMiddleware = require('lib/graphql-server/resolvers/apply-middleware')
const argValidator = require('lib/graphql-server/resolvers/middleware/arg-validator')

const ExistingUserError = createError('ExistingUserError', {
  message: 'A user with that email already exists'
})

module.exports = applyMiddleware([
  argValidator(combineValidators({
    input: {
      firstName: hasLengthBetween(1, 50)('First name'),
      lastName: hasLengthBetween(1, 50)('Last name'),
      email: isEmail('Email'),
      password: hasLengthBetween(6, 72)('Password'),
      hostBio: hasLengthBetween(1, 300)('Host Bio'),
      hostGooglePlaceId: isRequired('Host Google Place Id')
    }
  }))
], async function createHostUser (obj, args, ctx, info) {
  const {
    input: {
      firstName,
      lastName,
      email,
      password,
      hostBio,
      hostGooglePlaceId
    }
  } = args

  if (await User.findByEmail(email)) {
    throw new ExistingUserError('A user with that email already exists')
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    roles: ['host'],
    hostBio,
    hostGooglePlaceId
  })

  return { user }
})
