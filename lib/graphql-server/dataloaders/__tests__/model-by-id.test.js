/* eslint-env mocha */

const { truncateModel } = require('test-helpers')
const { User } = require('lib/db/models')
const { userFactory } = require('test-helpers/factories')
const modelById = require('../model-by-id')

describe('graphql-server/dataloaders/model-by-id', () => {
  it('finds a user by id', async () => {
    await truncateModel(User)
    const user = await User.create(userFactory())
    expect(await modelById(User).load(user.id)).to.deep.equal(user)
  })
})
