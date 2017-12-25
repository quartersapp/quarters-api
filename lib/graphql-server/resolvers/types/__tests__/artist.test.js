/* eslint-env jest */

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

let city, artist

beforeEach(async () => {
  await Promise.all([City, Artist].map(truncateModel))

  city = await City.query().insert(cityFactory()).returning('*')
  artist = await Artist.query().insert(artistFactory({ cityId: city.id })).returning('*')
})

describe('city', () => {
  it('returns the city', async () => {
    expect(await resolve(ArtistResolver.city, artist)).toEqual(city)
  })
})

describe('genres', () => {
  let genres

  beforeEach(async () => {
    await Promise.all([ArtistGenre, Genre].map(truncateModel))

    genres = await Promise.all(times(3, n => {
      return Genre
        .query()
        .insert(genreFactory({ name: `genre_${n}` }))
        .returning('*')
    }))

    await Promise.all(genres.map((genre, index) => {
      return ArtistGenre.query().insert({
        artistId: artist.id,
        genreId: genre.id,
        position: index
      })
    }))
  })

  it('returns the genres ordered by position & name', async () => {
    expect(await resolve(ArtistResolver.genres, artist)).toEqual(
      sortBy(genres, ['position', 'name'])
    )
  })
})

describe('shows', () => {
  let shows

  beforeEach(async () => {
    await Promise.all([ShowArtist, Show, Venue].map(truncateModel))

    const venue = await Venue
      .query()
      .insert(venueFactory({ cityId: city.id }))
      .returning('*')

    shows = await Promise.all(times(3, n => {
      return Show
        .query()
        .insert(showFactory({ venueId: venue.id }))
        .returning('*')
    }))

    await Promise.all(shows.map((show, index) => {
      return ShowArtist.query().insert({
        showId: show.id,
        artistId: artist.id,
        position: 0
      })
    }))
  })

  it('returns shows for the artist', async () => {
    expect(await resolve(ArtistResolver.shows, artist)).toEqual(
      sortBy(shows, ['day'])
    )
  })
})
