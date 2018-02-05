/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

const passwordService = require('lib/services/password-service')
const User = require('../user')

describe('db/models/user', () => {
  describe('isAdmin', () => {
    it('returns true if the user has an admin role', () => {
      const user = new User()

      user.roles = []
      expect(user.isAdmin()).to.equal(false)

      user.roles = ['admin']
      expect(user.isAdmin()).to.equal(true)
    })
  })

  it('stringifies roles before insertion & update', async () => {
    const user = new User()

    user.roles = []
    user.$beforeInsert()
    expect(user.roles).to.equal('[]')
    // ensure super was called
    expect(user.createdAt).to.be.ok
    expect(user.updatedAt).to.be.ok

    user.roles = []
    user.$beforeUpdate()
    expect(user.roles).to.equal('[]')
    expect(user.updatedAt).to.be.ok
  })

  it('hashes the password before insertion & update', async () => {
    const user = new User()

    user.password = 'test1234'
    await user.$beforeInsert()
    expect(user.passwordHash).to.be.ok
    expect(user.password).to.equal(undefined)
    expect(
      await passwordService.compare('test1234', user.passwordHash)
    ).to.equal(true)

    delete user.passwordHash
    user.password = 'test1234'
    await user.$beforeUpdate()
    expect(user.passwordHash).to.be.ok
    expect(user.password).to.equal(undefined)
    expect(
      await passwordService.compare('test1234', user.passwordHash)
    ).to.equal(true)
  })
})
