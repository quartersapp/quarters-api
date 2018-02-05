/* eslint-env mocha */

const { resolve } = require('../../test-helpers')
const UserResolver = require('../user')

describe('graphql-server/resolvers/types/user', () => {
  describe('name', () => {
    it('returns the email if no firstname/lastname exist', async () => {
      const user = { email: 'email@example.com' }
      expect(resolve(UserResolver.name, user)).to.equal('email@example.com')
    })

    it('returns just the first name if the last name does not exist', () => {
      const user = {
        email: 'email@example.com',
        firstName: 'John'
      }

      expect(resolve(UserResolver.name, user)).to.equal('John')
    })

    it('returns the first name and first letter of last name', () => {
      const user = {
        email: 'email@example.com',
        firstName: 'John',
        lastName: 'Smith'
      }

      expect(resolve(UserResolver.name, user)).to.equal('John S.')
    })
  })
})
