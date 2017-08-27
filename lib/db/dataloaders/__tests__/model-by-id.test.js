/* eslint-env jest */

const { times } = require('lodash')
const { User } = require('lib/db/models')
const { userFactory } = require('test-helpers/factories')
const { modelByIds } = require('../model-by-id')

describe('modelByIds', () => {
  it('takes an array of ids and maps those to records of the given model type', async () => {
    // test data
    await User.query().truncate()
    const users = await Promise.all(times(5, id => {
      return User.query().insert(userFactory())
    }))

    // instantiate
    const usersByIds = modelByIds(User)

    // test
    const ids = [...users.map(users => users.id), -1, -2]
    const result = await usersByIds(ids)
    const resultIds = result.map(result => result && result.id)
    expect(resultIds).toEqual([...users.map(user => user.id), null, null])
  })
})