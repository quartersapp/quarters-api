/* eslint-env jest */

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

let city, venue, show

beforeEach(async () => {
  await Promise.all([City, Venue].map(truncateModel))

  city = await City.query().insert(cityFactory()).returning('*')
  venue = await Venue.query().insert(venueFactory({ cityId: city.id })).returning('*')
  show = await Show.query().insert(showFactory({ venueId: venue.id })).returning('*')
})

describe('venue', () => {
  it('returns the venue', async () => {
    expect(await resolve(ShowResolver.venue, show)).toEqual(venue)
  })
})

describe('artists', () => {
  let artists

  beforeEach(async () => {
    await Promise.all([ShowArtist, Artist].map(truncateModel))

    artists = await Promise.all(times(3, () => {
      return Artist.query().insert(artistFactory({ cityId: city.id })).returning('*')
    }))

    await Promise.all(artists.map((artist, index) => {
      return ShowArtist.query().insert({
        artistId: artist.id,
        showId: show.id,
        position: index
      })
    }))
  })

  it('returns the artists ordered by position', async () => {
    expect(await resolve(ShowResolver.artists, show)).toEqual(artists)
  })
})
