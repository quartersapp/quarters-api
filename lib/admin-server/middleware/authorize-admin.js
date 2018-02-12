const { JsonWebTokenError } = require('jsonwebtoken')
const { decodeToken } = require('lib/services/token-service')
const { UnauthorizedError } = require('lib/errors')
const { User } = require('lib/db/models')

module.exports = () => async (ctx, next) => {
  const token = ctx.request.headers['authorization']

  if (!token) {
    throw new UnauthorizedError('missing_token', 'Missing auth token')
  }

  let payload

  try {
    payload = decodeToken(token.replace('Bearer ', ''))
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      throw new UnauthorizedError('invalid_token', 'Invalid token')
    } else {
      throw err
    }
  }

  const user = await User.findById(payload.userId)

  if (!user) {
    throw new UnauthorizedError('invalid_user', 'User does not exist')
  }

  if (!user || !user.isAdmin()) {
    throw new UnauthorizedError('invalid_user', 'User is not an admin')
  }

  Object.assign(ctx.state, { user })

  return next()
}
