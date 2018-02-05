/* eslint-env mocha */

const { times } = require('lodash')
const { User } = require('lib/db/models')
const { truncateModel } = require('test-helpers')
const { userFactory } = require('test-helpers/factories')
const modelsByIds = require('../models-by-ids')

describe('graphql-server/dataloaders/models-by-id', () => {
  it('takes an array of ids and maps those to records of the given model type', async () => {
    // test data
    await truncateModel(User)
    const users = await Promise.all(times(5, async id => {
      return User.query().insert(userFactory())
    }))

    // instantiate
    const usersByIds = modelsByIds(User)

    // test
    const ids = [...users.map(users => users.id), -1, -2]
    const result = await usersByIds(ids)
    const resultIds = result.map(result => result && result.id)
    expect(resultIds).to.deep.equal([...users.map(user => user.id), null, null])
  })
})
