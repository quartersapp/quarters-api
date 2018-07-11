/* eslint-env mocha */

const { isEmail } = require('../validators')

describe('graphql-server/resolvers/validators', () => {
  describe('isEmail', () => {
    const validate = isEmail('Email')

    it('returns an error for an invalid email', () => {
      const errorMsg = 'Email must be a valid email'
      expect(validate()).to.equal(errorMsg)
      expect(validate('bad')).to.equal(errorMsg)
      expect(validate('valid@gmail.com')).to.equal(undefined)
    })
  })
})
