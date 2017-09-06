/* eslint-env jest */

const { Kind } = require('graphql/language')
const resolver = require('../timestamp')

it('parses a javascript a JSON date string', () => {
  expect(
    resolver.parseValue(1504660256432)
  ).toEqual(new Date(1504660256432))
})

it('serializes a javascript date', () => {
  expect(
    resolver.serialize(new Date(1504660256432))
  ).toEqual(1504660256432)
})

describe('parseLiteral', () => {
  it('parses an integer', () => {
    expect(
      resolver.parseLiteral({ kind: Kind.INT, value: '1504660256432' })
    ).toEqual(1504660256432)
  })

  it('does not parse a string', () => {
    expect(
      resolver.parseLiteral({ kind: Kind.STRING, value: '1504660256432' })
    ).toEqual(null)
  })
})
