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
const { truncate, enableSnapshots } = require('test-helpers')

describe('integration-tests/graphql-server/show-page', () => {
  let show

  beforeEach(enableSnapshots)

  beforeEach(async () => {
    await truncate([
      ArtistGenre,
      Genre,
      ShowArtist,
      Artist,
      City,
      Show,
      Venue
    ])

    const city = await City.create({
      name: 'Toronto',
      googlePlaceId: 'place-id'
    })

    const venue = await Venue.create({
      name: 'Horseshoe Tavern',
      cityId: city.id,
      googlePlaceId: 'place-id'
    })

    show = await Show.create({
      venueId: venue.id,
      day: '2018-05-01',
      ageRestriction: '19+',
      doorTime: '18:00:00',
      ticketLink: 'http://some_url.com/tickets'
    })

    const andyShauf = await Artist.create({
      name: 'Andy Shauf',
      cityId: city.id
    })

    const bornRuffians = await Artist.create({
      name: 'Born Ruffians',
      cityId: city.id
    })

    await ShowArtist.insert({
      showId: show.id,
      artistId: andyShauf.id,
      position: 0
    })

    await ShowArtist.insert({
      showId: show.id,
      artistId: bornRuffians.id,
      position: 1
    })

    const genres = await Promise.all(['rock', 'folk', 'indie'].map(name => {
      return Genre.create({ name })
    }))

    await ArtistGenre.insert({
      artistId: andyShauf.id,
      genreId: genres[0].id,
      position: 0
    })

    await ArtistGenre.insert({
      artistId: andyShauf.id,
      genreId: genres[1].id,
      position: 1
    })

    await ArtistGenre.insert({
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

    expect(body).to.matchSnapshot()
  })
})
