/* eslint-env jest */

const { times, sortBy } = require('lodash')
const { City, Artist, Genre, ArtistGenre } = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { truncateModel } = require('test-helpers')
const {
  cityFactory,
  artistFactory,
  genreFactory
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
