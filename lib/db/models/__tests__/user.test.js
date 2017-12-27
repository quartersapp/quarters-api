/* eslint-env jest */

const passwordService = require('lib/services/password-service')
const User = require('../user')

describe('isAdmin', () => {
  it('returns true if the user has an admin role', () => {
    const user = new User()

    user.roles = []
    expect(user.isAdmin()).toEqual(false)

    user.roles = ['admin']
    expect(user.isAdmin()).toEqual(true)
  })
})

it('stringifies roles before insertion & update', async () => {
  const user = new User()

  user.roles = []
  user.$beforeInsert()
  expect(user.roles).toEqual('[]')
  // ensure super was called
  expect(user.createdAt).toBeTruthy()
  expect(user.updatedAt).toBeTruthy()

  user.roles = []
  user.$beforeUpdate()
  expect(user.roles).toEqual('[]')
  expect(user.updatedAt).toBeTruthy()
})

it('hashes the password before insertion & update', async () => {
  const user = new User()

  user.password = 'test1234'
  await user.$beforeInsert()
  expect(user.passwordHash).toBeTruthy()
  expect(user.password).not.toBeDefined()
  expect(
    await passwordService.compare('test1234', user.passwordHash)
  ).toEqual(true)

  delete user.passwordHash
  user.password = 'test1234'
  await user.$beforeUpdate()
  expect(user.passwordHash).toBeTruthy()
  expect(user.password).not.toBeDefined()
  expect(
    await passwordService.compare('test1234', user.passwordHash)
  ).toEqual(true)
})
