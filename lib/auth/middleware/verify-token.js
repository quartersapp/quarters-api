const { JsonWebTokenError } = require('jsonwebtoken')
const { decode } = require('../token-service')
const { UnauthorizedError } = require('lib/errors')

module.exports = () => async (ctx, next) => {
  const token = ctx.request.headers['authorization']

  if (!token) return next()

  try {
    const payload = decode(token.replace('Bearer ', ''))
    ctx.state.userId = payload.userId
    return next()
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      throw new UnauthorizedError('invalid_token', 'Invalid token')
    } else {
      throw err
    }
  }
}
