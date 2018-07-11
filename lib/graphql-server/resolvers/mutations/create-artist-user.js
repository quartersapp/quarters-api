const {
  combineValidators,
  isRequired,
  hasLengthBetween
} = require('revalidate')
const { isEmail } = require('lib/graphql-server/resolvers/validators')
const { Artist, User, City } = require('lib/db/models')
const transaction = require('lib/db/transaction')
const { createError } = require('apollo-errors')
const applyMiddleware = require('lib/graphql-server/resolvers/apply-middleware')
const argValidator = require('lib/graphql-server/resolvers/middleware/arg-validator')
const { InvalidArgumentsError } = require('lib/graphql-server/errors')

const ExistingUserError = createError('ExistingUserError', {
  message: 'A user with that email already exists'
})

module.exports = applyMiddleware([
  argValidator(combineValidators({
    input: {
      firstName: hasLengthBetween(1, 50)('First name'),
      lastName: hasLengthBetween(1, 50)('Last name'),
      artistName: hasLengthBetween(1, 50)('Artist name'),
      email: isEmail('Email'),
      password: hasLengthBetween(6, 72)('Password'),
      cityId: isRequired('City ID')
    }
  }))
], async function createArtistUser (obj, args, ctx, info) {
  const {
    input: {
      firstName,
      lastName,
      artistName,
      email,
      password,
      cityId
    }
  } = args

  if (await User.findByEmail(email)) {
    throw new ExistingUserError('A user with that email already exists')
  }

  if (!(await City.findById(cityId))) {
    throw new InvalidArgumentsError({
      data: {
        cityId: 'Is not a valid city'
      }
    })
  }

  const artist = await transaction(async trx => {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      roles: ['artistManager']
    }, { trx })

    return Artist.create({
      name: artistName,
      managerUserId: user.id,
      transaction,
      cityId: cityId
    }, { trx })
  })

  return { artist }
})
