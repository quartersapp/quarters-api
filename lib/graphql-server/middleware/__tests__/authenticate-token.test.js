/* eslint-env jest */

const { generateToken } = require('lib/services/token-service')
const { UnauthorizedError } = require('lib/errors')
const authenticateToken = require('../authenticate-token')()

it('calls next if no token is passed', async () => {
  const ctx = {
    request: {
      headers: {}
    }
  }
  const next = jest.fn()
  await authenticateToken(ctx, next)
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
  await expect(authenticateToken(ctx, next)).rejects.toMatchObject(new UnauthorizedError('invalid_token'))
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

  const next = jest.fn()

  await authenticateToken(ctx, next)
  expect(next).toBeCalled()
  expect(ctx.body).toBeUndefined()
  expect(ctx.state.userId).toEqual(5)
})
