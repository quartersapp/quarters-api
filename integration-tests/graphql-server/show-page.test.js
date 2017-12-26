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

let show

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

  const venue = await Venue.query()
    .insert({
      name: 'Horseshoe Tavern',
      cityId: city.id,
      googlePlaceId: 'place-id'
    })
    .returning('*')

  show = await Show.query()
    .insert({
      venueId: venue.id,
      day: '2018-05-01',
      ageRestriction: '19+',
      doorTime: '18:00:00',
      ticketLink: 'http://some_url.com/tickets'
    })
    .returning('*')

  const andyShauf = await Artist.query()
    .insert({
      name: 'Andy Shauf',
      cityId: city.id
    })
    .returning('*')

  const bornRuffians = await Artist.query()
    .insert({
      name: 'Born Ruffians',
      cityId: city.id
    })
    .returning('*')

  await ShowArtist.query().insert({
    showId: show.id,
    artistId: andyShauf.id,
    position: 0
  })

  await ShowArtist.query().insert({
    showId: show.id,
    artistId: bornRuffians.id,
    position: 1
  })

  const genres = await Promise.all(['rock', 'folk', 'indie'].map(name => {
    return Genre.query().insert({ name }).returning('*')
  }))

  await ArtistGenre.query().insert({
    artistId: andyShauf.id,
    genreId: genres[0].id,
    position: 0
  })

  await ArtistGenre.query().insert({
    artistId: andyShauf.id,
    genreId: genres[1].id,
    position: 1
  })

  await ArtistGenre.query().insert({
    artistId: bornRuffians.id,
    genreId: genres[2].id,
    position: 0
  })
})

it('can be queried for a show', async () => {
  const query = `
    {
      show (id: ${show.id}) {
        day
        doorTime
        ageRestriction
        ticketLink
        venue {
          name
          googlePlaceId
        }
        artists {
          name
          genres { name }
        }
      }
    }
  `

  const { body } = await request(app)
    .post('/graphql')
    .send({ query })

  expect(body).toMatchSnapshot()
})
