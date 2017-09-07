/* eslint-env jest */

const { resolve } = require('../../test-helpers')
const { truncateModel } = require('test-helpers')
const { userFactory } = require('test-helpers/factories')
const { User } = require('lib/db/models')
const currentUser = require('../current-user')

let user

beforeEach(async () => {
  await truncateModel(User)
  user = await User.query().insert(userFactory()).returning('*')
})

it('returns null if no user is authenticated', async () => {
  expect(await resolve(currentUser)).toBeNull()
})

it('returns the authenticated user', async () => {
  expect(await resolve(currentUser, undefined, undefined, user.id)).toEqual(user)
})
