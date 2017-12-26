/* eslint-env jest */

const { generateToken } = require('lib/services/token-service')
const { UnauthorizedError } = require('lib/errors')
const authorizeAdmin = require('../authorize-admin')()
const { truncateModel } = require('test-helpers')
const { User } = require('lib/db/models')
const { userFactory } = require('test-helpers/factories')

it('throw UnauthorizedError if no token is passed', async () => {
  const ctx = {
    request: {
      headers: {}
    }
  }
  const next = jest.fn()
  expect(next).not.toBeCalled()
  await expect(
    authorizeAdmin(ctx, next)
  ).rejects.toThrow(new UnauthorizedError('missing_token', 'Missing auth token'))
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
  await expect(
    authorizeAdmin(ctx, next)
  ).rejects.toThrow(new UnauthorizedError('invalid_token', 'Invalid token'))
})

it('throws UnauthorizedError if the user does not exist', async () => {
  const ctx = {
    request: {
      headers: {
        'authorization': generateToken({ id: -1 })
      }
    }
  }

  const next = jest.fn()
  expect(next).not.toBeCalled()
  await expect(
    authorizeAdmin(ctx, next)
  ).rejects.toThrow(new UnauthorizedError('invalid_user', 'User does not exist'))
})

it('throws UnauthorizedError if the user is not an admin', async () => {
  await truncateModel(User)
  const user = await User.query()
    .insert(userFactory({ roles: [] }))
    .returning('*')

  const ctx = {
    request: {
      headers: {
        'authorization': generateToken(user)
      }
    }
  }

  const next = jest.fn()
  expect(next).not.toBeCalled()
  await expect(
    authorizeAdmin(ctx, next)
  ).rejects.toThrow(new UnauthorizedError('invalid_user', 'User is not an admin'))
})

it('sets the user to ctx.state and calls next if user is admin', async () => {
  await truncateModel(User)
  const user = await User.query()
    .insert(userFactory({ roles: ['admin'] }))
    .returning('*')

  const ctx = {
    request: {
      headers: {
        'authorization': generateToken(user)
      }
    },
    state: {}
  }

  const next = jest.fn()
  await authorizeAdmin(ctx, next)
  expect(next).toBeCalled()
  expect(ctx.state).toHaveProperty('user')
  expect(ctx.state.user).toEqual(user)
})
