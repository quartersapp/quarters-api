/* eslint-env mocha */

const { fixture, truncate } = require('test-helpers')
const { UnauthorizedError } = require('lib/errors')
const { User } = require('lib/db/models')
const { decodeToken } = require('lib/services/token-service')
const { hash } = require('lib/services/password-service')
const loginRoute = require('../login-route')

describe('auth-server/login-route', () => {
  let user

  beforeEach(async () => {
    await truncate(User)
    user = await fixture(User, ({
      email: 'test@example.com',
      passwordHash: await hash('test_password123')
    }))
  })

  it('throws UnauthorizedError if no email or password is provided', async () => {
    let ctx = { request: { body: { email: 'user@example.com' } } }
    await expect(loginRoute(ctx)).to.be.rejectedWith(UnauthorizedError)

    ctx = { request: { body: { password: 'some_password' } } }
    await expect(loginRoute(ctx)).to.be.rejectedWith(UnauthorizedError)
  })

  it('throws UnauthorizedError if the user does not exist', async () => {
    let ctx = { request: { body: { email: 'wrong@example.com', password: 'password' } } }
    await expect(loginRoute(ctx)).to.be.rejectedWith(UnauthorizedError)
  })

  it('throws UnauthorizedError if the password is incorrect', async () => {
    const ctx = {
      request: {
        body: {
          email: 'test@example.com',
          password: 'wrong'
        }
      }
    }

    await expect(loginRoute(ctx)).to.be.rejectedWith(UnauthorizedError)
  })

  it('responds with an authentication token given valid credentials', async () => {
    const ctx = {
      request: {
        body: {
          email: 'test@example.com',
          password: 'test_password123'
        }
      }
    }

    await loginRoute(ctx)

    expect(ctx.body).to.have.property('token')
    expect(ctx.status).to.equal(200)
    const { userId } = decodeToken(ctx.body.token)
    expect(userId).to.equal(user.id)
  })
})
