/* eslint-env mocha */

const request = require('supertest')
const app = require('lib/app').listen()
const {
  Genre,
  ArtistGenre,
  Artist,
  City,
  Show,
  Venue,
  ShowArtist
} = require('lib/db/models')
const { truncateModel, enableSnapshots } = require('test-helpers')

describe('integration-tests/graphql-server/artist-page', () => {
  let artist

  beforeEach(enableSnapshots)

  beforeEach(async () => {
    await Promise.all([
      ArtistGenre,
      Genre,
      ShowArtist,
      Artist,
      City,
      Show,
      Venue
    ].map(truncateModel))

    const city = await City.create({
      name: 'Toronto',
      googlePlaceId: 'place-id'
    })

    artist = await Artist.create({
      name: 'Andy Shauf',
      cityId: city.id,
      bio: 'Juno-award winning artist from Canada'
    })

    const venue = await Venue.create({
      name: 'Horseshoe Tavern',
      cityId: city.id,
      googlePlaceId: 'place-id'
    })

    const show1 = await Show.create({
      venueId: venue.id,
      day: '2018-05-01'
    })

    const show2 = await Show.create({
      venueId: venue.id,
      day: '2018-05-015'
    })

    await ShowArtist.insert({
      showId: show1.id,
      artistId: artist.id,
      position: 0
    })

    await ShowArtist.insert({
      showId: show2.id,
      artistId: artist.id,
      position: 0
    })

    const genres = await Promise.all(['rock', 'folk', 'indie'].map(name => {
      return Genre.create({ name })
    }))

    await ArtistGenre.insert({
      artistId: artist.id,
      genreId: genres[0].id,
      position: 0
    })

    await ArtistGenre.insert({
      artistId: artist.id,
      genreId: genres[1].id,
      position: 1
    })
  })

  it('can be queried for an artist', async () => {
    const query = `
      {
        artist (id: ${artist.id}) {
          city { name }
          bio
          genres { name }
          shows {
            day
            venue {
              name
              city { name }
            }
            artists {
              name
            }
          }
        }
      }
    `

    const { body } = await request(app)
      .post('/graphql')
      .send({ query })

    expect(body).to.matchSnapshot()
  })
})
