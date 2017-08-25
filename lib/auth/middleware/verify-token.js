const { AUTH: { TOKEN_SECRET } } = require('config')
const { verify, JsonWebTokenError } = require('jsonwebtoken')
const { UnauthorizedError } = require('lib/errors')

module.exports = () => async (ctx, next) => {
  const token = ctx.request.headers['authorization']

  if (!token) return next()

  try {
    ctx.state.user = verify(token.replace('Bearer ', ''), TOKEN_SECRET)
    return next()
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      throw new UnauthorizedError('invalid_token', 'Invalid token')
    } else {
      throw err
    }
  }
}
