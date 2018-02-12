const { User } = require('lib/db/models')
const { UnauthorizedError } = require('lib/errors')
const { generateToken } = require('lib/services/token-service')
const { compare } = require('lib/services/password-service')

class InvalidCredentialsError extends UnauthorizedError {
  constructor () {
    super('invalid_credentials', 'Invalid credentials')
  }
}

module.exports = async ctx => {
  const { email, password } = ctx.request.body

  if (!email || !password) throw new InvalidCredentialsError()

  const user = await User.findByEmail(email)
  if (!user) throw new InvalidCredentialsError()

  if (!(await compare(password, user.passwordHash))) {
    throw new InvalidCredentialsError()
  }

  const token = generateToken(user)
  ctx.status = 200
  ctx.body = { token }
}
