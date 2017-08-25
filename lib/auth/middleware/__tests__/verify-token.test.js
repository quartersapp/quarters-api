/* eslint-env jest */

const { encode } = require('../../token-service')
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
  await expect(verifyToken(ctx, next)).rejects.toMatchObject(new UnauthorizedError('invalid_token'))
})

it('assigns currentUserId to state and calls next if the token is valid', async () => {
  const userId = 5

  const ctx = {
    request: {
      headers: {
        authorization: `Bearer ${encode({ userId })}`
      }
    },
    state: {}
  }

  const next = jest.fn()

  await verifyToken(ctx, next)
  expect(next).toBeCalled()
  expect(ctx.body).toBeUndefined()
  expect(ctx.state.userId).toEqual(userId)
})
