/* eslint-env mocha */

const { times } = require('lodash')
const { Artist, City, Show, Venue, ShowArtist } = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { truncateModel } = require('test-helpers')
const {
  artistFactory,
  cityFactory,
  showFactory,
  venueFactory
} = require('test-helpers/factories')
const ShowResolver = require('../show')

describe('graphql-server/resolvers/types/show', () => {
  let city, venue, show

  beforeEach(async () => {
    await Promise.all([City, Venue].map(truncateModel))

    city = await City.create(cityFactory())
    venue = await Venue.create(venueFactory({ cityId: city.id }))
    show = await Show.create(showFactory({ venueId: venue.id }))
  })

  describe('venue', () => {
    it('returns the venue', async () => {
      expect(await resolve(ShowResolver.venue, show)).to.deep.equal(venue)
    })
  })

  describe('artists', () => {
    let artists

    beforeEach(async () => {
      await Promise.all([ShowArtist, Artist].map(truncateModel))

      artists = await Promise.all(times(3, () => {
        return Artist.create(artistFactory({ cityId: city.id }))
      }))

      await Promise.all(artists.map((artist, index) => {
        return ShowArtist.insert({
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
