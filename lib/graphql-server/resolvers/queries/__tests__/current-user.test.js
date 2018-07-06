/* eslint-env mocha */

const { resolve } = require('../../test-helpers')
const { fixture, truncate } = require('test-helpers')
const { User } = require('lib/db/models')
const currentUser = require('../current-user')

describe('graphql-server/resolvers/queries/current-user', () => {
  let user

  beforeEach(async () => {
    await truncate(User)
    user = await fixture(User)
  })

  it('returns null if no user is authenticated', async () => {
    expect(await resolve(currentUser)).to.equal(null)
  })

  it('returns the authenticated user', async () => {
    expect(await resolve(currentUser, undefined, undefined, user.id)).to.deep.equal(user)
  })
})
