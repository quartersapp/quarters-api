/* eslint-env jest */

const { userFactory } = require('test-helpers/factories')
const { User } = require('lib/db/models')
const dataLoaders = require('lib/db/dataloaders')
const currentUser = require('../currentUser')

let user

beforeEach(async () => {
  await User.query().truncate()
  user = await User.query().insert(userFactory()).returning('*')
})

it('returns null if no user is authenticated', async () => {
  expect(await currentUser(undefined, {}, { loaders: dataLoaders() })).toBeNull()
})

it('returns the authenticated user', async () => {
  expect(await currentUser(undefined, {}, { userId: user.id, loaders: dataLoaders() })).toEqual(user)
})
