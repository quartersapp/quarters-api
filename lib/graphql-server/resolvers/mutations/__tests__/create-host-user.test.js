/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

const { User } = require('lib/db/models')
const createHostUser = require('../create-host-user')
const { truncateModel } = require('test-helpers')

describe('graphql-server/resolvers/mutations/create-host-user', () => {
  beforeEach(() => truncateModel(User))

  const args = {
    input: {
      firstName: 'Lucas',
      lastName: 'McLaughlin',
      email: 'lucas@gmail.com',
      password: 'passpass1234'
    }
  }

  it('creates a host user', async () => {
    const result = await createHostUser(null, args)
    expect(result).to.have.property('user')
    const user = await User.findByEmail('lucas@gmail.com')
    expect(user).to.be.ok
    expect(user.id).to.equal(result.user.id)
  })

  it('yields an error if a user with the specified email already exists', async () => {
    await User.insert(args.input)
    await expect(
      createHostUser(null, args)
    ).to.be.rejectedWith(Error, 'A user with that email already exists')
  })
})
