/* eslint-env jest */

const { User } = require('lib/db/models')
const currentUser = require('../currentUser')

it('returns null if no user is authenticated', async () => {
  expect(await currentUser(undefined, {}, {})).toBeNull()
})

it('returns the authenticated user', async () => {
  await User.query().truncate()
  const user = await User.query().insert({ email: 'test@example.com' }).returning('*')
  expect(await currentUser(undefined, {}, { userId: user.id })).toEqual(user)
})
