/* eslint-env jest */

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
const { truncateModel } = require('test-helpers')

let artist

afterAll(() => require('lib/db/connection').destroy())

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

  const city = await City.query()
    .insert({
      name: 'Toronto',
      googlePlaceId: 'place-id'
    })
    .returning('*')

  artist = await Artist.query()
    .insert({
      name: 'Andy Shauf',
      cityId: city.id,
      bio: 'Juno-award winning artist from Canada'
    })
    .returning('*')

  const venue = await Venue.query()
    .insert({
      name: 'Horseshoe Tavern',
      cityId: city.id,
      googlePlaceId: 'place-id'
    })
    .returning('*')

  const show1 = await Show.query()
    .insert({
      venueId: venue.id,
      day: '2018-05-01'
    })
    .returning('*')

  const show2 = await Show.query()
    .insert({
      venueId: venue.id,
      day: '2018-05-015'
    })
    .returning('*')

  await ShowArtist.query().insert({
    showId: show1.id,
    artistId: artist.id,
    position: 0
  })

  await ShowArtist.query().insert({
    showId: show2.id,
    artistId: artist.id,
    position: 0
  })

  const genres = await Promise.all(['rock', 'folk', 'indie'].map(name => {
    return Genre.query().insert({ name }).returning('*')
  }))

  await ArtistGenre.query().insert({
    artistId: artist.id,
    genreId: genres[0].id,
    position: 0
  })

  await ArtistGenre.query().insert({
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

  expect(body).toMatchSnapshot()
})
