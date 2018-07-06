/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

const { User } = require('lib/db/models')
const createHostUser = require('../create-host-user')
const { truncate } = require('test-helpers')

describe('graphql-server/resolvers/mutations/create-host-user', () => {
  beforeEach(() => truncate(User))

  const args = {
    input: {
      firstName: 'Lucas',
      lastName: 'McLaughlin',
      email: 'lucas@gmail.com',
      password: 'passpass1234',
      hostBio: 'test host bio',
      hostGooglePlaceId: 'test_google_place_id'
    }
  }

  it('creates a host user', async () => {
    const result = await createHostUser(null, args)
    expect(result).to.have.property('user')
    const user = await User.findByEmail('lucas@gmail.com')
    expect(user).to.be.ok
    expect(user.id).to.equal(result.user.id)
    expect(user.isHost).to.equal(true)
    expect(user.hostGooglePlaceId).to.equal('test_google_place_id')
    expect(user.hostBio).to.equal('test host bio')
  })

  it('yields an error if a user with the specified email already exists', async () => {
    await User.insert(args.input)
    await expect(
      createHostUser(null, args)
    ).to.be.rejectedWith(Error, 'A user with that email already exists')
  })
})
