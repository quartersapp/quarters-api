const { User } = require('lib/db/models')
const { UnauthorizedError } = require('lib/errors')
const { encode } = require('../token-service')
const { compare } = require('../password-service')

class InvalidCredentialsError extends UnauthorizedError {
  constructor () {
    super('invalid_credentials', 'Invalid credentials')
  }
}

module.exports = async ctx => {
  const { email, password } = ctx.request.body

  if (!email || !password) throw new InvalidCredentialsError()

  const user = await User.query().findOne({ email })
  if (!user) throw new InvalidCredentialsError()

  if (!(await compare(password, user.passwordHash))) {
    throw new InvalidCredentialsError()
  }

  const token = encode({ userId: user.id })
  ctx.status = 200
  ctx.body = { token }
}
