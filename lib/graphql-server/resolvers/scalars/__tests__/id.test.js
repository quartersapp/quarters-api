/* eslint-env mocha */

const { Kind } = require('graphql/language')
const resolver = require('../id')

describe('graphql-server/resolvers/scalars/id', () => {
  describe('parseLiteral', () => {
    it('parses an integer', () => {
      expect(
        resolver.parseLiteral({ kind: Kind.INT, value: '1504660256432' })
      ).to.equal(1504660256432)
    })

    it('does not parse a string', () => {
      expect(
        resolver.parseLiteral({ kind: Kind.STRING, value: '1504660256432' })
      ).to.equal(null)
    })
  })
})
