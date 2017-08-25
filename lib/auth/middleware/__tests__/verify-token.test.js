/* eslint-env jest */

const { AUTH: { TOKEN_SECRET } } = require('config')
const { sign } = require('jsonwebtoken')
const { UnauthorizedError } = require('lib/errors')
const verifyToken = require('../verify-token')()

it('calls next if no token is passed', async () => {
  const ctx = {
    request: {
      headers: {}
    }
  }
  const next = jest.fn()
  await verifyToken(ctx, next)
  expect(next).toBeCalled()
})

it('throws UnauthorizedError if the token is invalid', async () => {
  const ctx = {
    request: {
      headers: {
        'authorization': 'bad_token'
      }
    }
  }

  const next = jest.fn()
  expect(next).not.toBeCalled()
  expect(verifyToken(ctx, next)).rejects.toMatchObject(new UnauthorizedError('invalid_token'))
})

it('assigns user to state and calls next if the token is valid', async () => {
  const user = { id: 5 }

  const ctx = {
    request: {
      headers: {
        authorization: `Bearer ${sign(user, TOKEN_SECRET)}`
      }
    },
    state: {}
  }

  const next = jest.fn()

  await verifyToken(ctx, next)
  expect(next).toBeCalled()
  expect(ctx.body).toBeUndefined()
  expect(ctx.state.user).toMatchObject(user)
})
