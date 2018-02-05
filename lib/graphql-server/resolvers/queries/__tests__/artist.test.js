/* eslint-env mocha */

const { truncateModel } = require('test-helpers')
const { resolve } = require('../../test-helpers')
const artistResolver = require('../artist')
const {
  artistFactory,
  cityFactory
} = require('test-helpers/factories')
const { Artist, City } = require('lib/db/models')

describe('graphql-server/resolvers/queries/artist', () => {
  let city

  beforeEach(async () => {
    await Promise.all([Artist, City].map(truncateModel))
    city = await City.query().insert(cityFactory()).returning('*')
  })

  it('returns null if no artist exists', async () => {
    expect(
      await resolve(artistResolver, undefined, { id: 1 })
    ).to.equal(null)
  })

  it('returns an by its id', async () => {
    const artist = await Artist.query()
      .insert(artistFactory({ cityId: city.id }))
      .returning('*')

    expect(
      await resolve(artistResolver, undefined, { id: artist.id })
    ).to.deep.equal(artist)
  })
})
