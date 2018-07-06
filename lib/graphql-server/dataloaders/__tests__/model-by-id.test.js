/* eslint-env mocha */

const { fixture, truncate } = require('test-helpers')
const { User } = require('lib/db/models')
const modelById = require('../model-by-id')

describe('graphql-server/dataloaders/model-by-id', () => {
  it('finds a user by id', async () => {
    await truncate(User)
    const user = await fixture(User)
    expect(await modelById(User).load(user.id)).to.deep.equal(user)
  })
})
