/* eslint-env jest */

const { User } = require('lib/db/models')
const { userFactory } = require('test-helpers/factories')
const modelById = require('../model-by-id')

describe('modelById', () => {
  it('finds a user by id', async () => {
    await User.query().truncate()
    const user = await User.query().insert(userFactory()).returning('*')
    expect(await modelById(User)(user.id)).toEqual(user)
  })
})
