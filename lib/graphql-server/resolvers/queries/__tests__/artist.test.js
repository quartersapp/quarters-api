/* eslint-env mocha */

const { fixture, truncate } = require('test-helpers')
const { resolve } = require('../../test-helpers')
const artistResolver = require('../artist')
const { Artist, City } = require('lib/db/models')

describe('graphql-server/resolvers/queries/artist', () => {
  let city

  beforeEach(async () => {
    await truncate([Artist, City])
    city = await fixture(City)
  })

  it('returns null if no artist exists', async () => {
    expect(
      await resolve(artistResolver, undefined, { id: 1 })
    ).to.equal(null)
  })

  it('returns an by its id', async () => {
    const artist = await fixture(Artist, { cityId: city.id })

    expect(
      await resolve(artistResolver, undefined, { id: artist.id })
    ).to.deep.equal(artist)
  })
})
