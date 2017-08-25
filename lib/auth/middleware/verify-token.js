const { AUTH: { TOKEN_SECRET } } = require('config')
const { verify } = require('jsonwebtoken')

module.exports = () => async (ctx, next) => {
  const token = ctx.request.headers['authorization']

  if (!token) return next()

  try {
    ctx.state.user = verify(token.replace('Bearer ', ''), TOKEN_SECRET)
    return next()
  } catch (err) {
    ctx.status = 401
    ctx.body = { message: 'Invalid token' }
  }
}
