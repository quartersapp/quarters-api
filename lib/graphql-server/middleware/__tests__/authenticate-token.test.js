/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

const sinon = require('sinon')
const { generateToken } = require('lib/services/token-service')
const { UnauthorizedError } = require('lib/errors')
const authenticateToken = require('../authenticate-token')()

describe('graphql-server/middleware/authenticate-token', () => {
  it('calls next if no token is passed', async () => {
    const ctx = {
      request: {
        headers: {}
      }
    }
    const next = sinon.spy()
    await authenticateToken(ctx, next)
    expect(next).to.be.called
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
      authenticateToken(ctx, next)
    ).to.be.rejectedWith(UnauthorizedError, 'Invalid token')
  })

  it('assigns currentUserId to state and calls next if the token is valid', async () => {
    const user = { id: 5 }

    const ctx = {
      request: {
        headers: {
          authorization: `Bearer ${generateToken(user)}`
        }
      },
      state: {}
    }

    const next = sinon.spy()

    await authenticateToken(ctx, next)
    expect(next).to.be.called
    expect(ctx.body).to.equal(undefined)
    expect(ctx.state.userId).to.equal(5)
  })
})
