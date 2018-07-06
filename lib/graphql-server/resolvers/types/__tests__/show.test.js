/* eslint-env mocha */

const { times } = require('lodash')
const { Artist, City, Show, Venue, ShowArtist } = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { fixture, truncate } = require('test-helpers')
const ShowResolver = require('../show')

describe('graphql-server/resolvers/types/show', () => {
  let city, venue, show

  beforeEach(async () => {
    await truncate([City, Venue])

    city = await fixture(City)
    venue = await fixture(Venue, { cityId: city.id })
    show = await fixture(Show, { venueId: venue.id })
  })

  describe('venue', () => {
    it('returns the venue', async () => {
      expect(await resolve(ShowResolver.venue, show)).to.deep.equal(venue)
    })
  })

  describe('artists', () => {
    let artists

    beforeEach(async () => {
      await truncate([ShowArtist, Artist])

      artists = await Promise.all(times(3, () => {
        return fixture(Artist, { cityId: city.id })
      }))

      await Promise.all(artists.map((artist, index) => {
        return fixture(ShowArtist, {
          artistId: artist.id,
          showId: show.id,
          position: index
        })
      }))
    })

    it('returns the artists ordered by position', async () => {
      expect(await resolve(ShowResolver.artists, show)).to.deep.equal(artists)
    })
  })
})
