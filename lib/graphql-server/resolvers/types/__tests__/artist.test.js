/* eslint-env mocha */

const { times, sortBy } = require('lodash')
const {
  City,
  Artist,
  Genre,
  ArtistGenre,
  ShowArtist,
  Show,
  Venue
} = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { truncateModel } = require('test-helpers')
const {
  cityFactory,
  artistFactory,
  genreFactory,
  showFactory,
  venueFactory
} = require('test-helpers/factories')
const ArtistResolver = require('../artist')

describe('graphql-server/resolvers/types/artist', () => {
  let city, artist

  beforeEach(async () => {
    await Promise.all([City, Artist].map(truncateModel))

    city = await City.create(cityFactory())
    artist = await Artist.create(artistFactory({ cityId: city.id }))
  })

  describe('city', () => {
    it('returns the city', async () => {
      expect(await resolve(ArtistResolver.city, artist)).to.deep.equal(city)
    })
  })

  describe('genres', () => {
    let genres

    beforeEach(async () => {
      await Promise.all([ArtistGenre, Genre].map(truncateModel))

      genres = await Promise.all(times(3, n => {
        return Genre.create(genreFactory({ name: `genre_${n}` }))
      }))

      await Promise.all(genres.map((genre, index) => {
        return ArtistGenre.insert({
          artistId: artist.id,
          genreId: genre.id,
          position: index
        })
      }))
    })

    it('returns the genres ordered by position & name', async () => {
      expect(await resolve(ArtistResolver.genres, artist)).to.deep.equal(
        sortBy(genres, ['position', 'name'])
      )
    })
  })

  describe('shows', () => {
    let shows

    beforeEach(async () => {
      await Promise.all([ShowArtist, Show, Venue].map(truncateModel))

      const venue = await Venue.create(venueFactory({ cityId: city.id }))

      shows = await Promise.all(times(3, n => {
        return Show.create(showFactory({ venueId: venue.id }))
      }))

      await Promise.all(shows.map((show, index) => {
        return ShowArtist.insert({
          showId: show.id,
          artistId: artist.id,
          position: 0
        })
      }))
    })

    it('returns shows for the artist', async () => {
      expect(await resolve(ArtistResolver.shows, artist)).to.deep.equal(
        sortBy(shows, ['day'])
      )
    })
  })
})
