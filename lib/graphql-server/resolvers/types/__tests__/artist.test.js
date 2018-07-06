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
const { fixture, truncate } = require('test-helpers')
const ArtistResolver = require('../artist')

describe('graphql-server/resolvers/types/artist', () => {
  let city, artist

  beforeEach(async () => {
    await truncate([City, Artist])

    city = await fixture(City)
    artist = await fixture(Artist, { cityId: city.id })
  })

  describe('city', () => {
    it('returns the city', async () => {
      expect(await resolve(ArtistResolver.city, artist)).to.deep.equal(city)
    })
  })

  describe('genres', () => {
    let genres

    beforeEach(async () => {
      await truncate([ArtistGenre, Genre])

      genres = await Promise.all(times(3, n => {
        return fixture(Genre, { name: `genre_${n}` })
      }))

      await Promise.all(genres.map((genre, index) => {
        return fixture(ArtistGenre, {
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
      await truncate([ShowArtist, Show, Venue])

      const venue = await fixture(Venue, { cityId: city.id })

      shows = await Promise.all(times(3, n => {
        return fixture(Show, { venueId: venue.id })
      }))

      await Promise.all(shows.map((show, index) => {
        return fixture(ShowArtist, {
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
