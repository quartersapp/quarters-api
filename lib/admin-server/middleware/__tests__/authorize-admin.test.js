/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

const sinon = require('sinon')
const { generateToken } = require('lib/services/token-service')
const { UnauthorizedError } = require('lib/errors')
const authorizeAdmin = require('../authorize-admin')()
const { fixture, truncate } = require('test-helpers')
const { User } = require('lib/db/models')

describe('admin-server/middleware/authorize-admin', () => {
  it('throws UnauthorizedError if no token is passed', async () => {
    const ctx = {
      request: {
        headers: {}
      }
    }
    const next = sinon.spy()
    await expect(
      authorizeAdmin(ctx, next)
    ).to.be.rejectedWith(UnauthorizedError, 'Missing auth token')
  })

  it('throws UnauthorizedError if the token is invalid', async () => {
    const ctx = {
      request: {
        headers: {
          'authorization': 'bad_token'
        }
      }
    }

    const next = sinon.spy()
    await expect(
      authorizeAdmin(ctx, next)
    ).to.be.rejectedWith(UnauthorizedError, 'Invalid token')
  })

  it('throws UnauthorizedError if the user does not exist', async () => {
    const ctx = {
      request: {
        headers: {
          'authorization': generateToken({ id: -1 })
        }
      }
    }

    const next = sinon.spy()
    await expect(
      authorizeAdmin(ctx, next)
    ).to.be.rejectedWith(UnauthorizedError, 'User does not exist')
  })

  it('throws UnauthorizedError if the user is not an admin', async () => {
    await truncate(User)
    const user = await fixture(User, { roles: [] })

    const ctx = {
      request: {
        headers: {
          'authorization': generateToken(user)
        }
      }
    }

    const next = sinon.spy()
    await expect(
      authorizeAdmin(ctx, next)
    ).to.be.rejectedWith(UnauthorizedError, 'User is not an admin')
  })

  it('sets the user to ctx.state and calls next if user is admin', async () => {
    await truncate(User)
    const user = await fixture(User, { roles: ['admin'] })

    const ctx = {
      request: {
        headers: {
          'authorization': generateToken(user)
        }
      },
      state: {}
    }

    const next = sinon.spy()
    await authorizeAdmin(ctx, next)
    expect(next).to.be.calledOnce
    expect(ctx.state).to.have.property('user')
    expect(ctx.state.user).to.deep.equal(user)
  })
})
