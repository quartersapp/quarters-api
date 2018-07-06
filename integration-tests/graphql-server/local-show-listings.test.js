/* eslint-env mocha */

const request = require('supertest')
const app = require('lib/app').listen()
const {
  Artist,
  City,
  Show,
  Venue,
  ShowArtist
} = require('lib/db/models')
const { truncate, enableSnapshots } = require('test-helpers')

describe('integration-tests/graphql-server/local-show-listings', () => {
  let city

  beforeEach(enableSnapshots)

  beforeEach(async () => {
    await truncate([
      ShowArtist,
      Artist,
      City,
      Show,
      Venue
    ])

    city = await City.create({
      name: 'Toronto',
      googlePlaceId: 'place-id'
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
      day: '2018-05-05'
    })

    const andyShauf = await Artist.create({
      name: 'Andy Shauf',
      cityId: city.id
    })

    const bornRuffians = await Artist.create({
      name: 'Born Ruffians',
      cityId: city.id
    })

    const localNatives = await Artist.create({
      name: 'Local Natives',
      cityId: city.id
    })

    await ShowArtist.insert({
      showId: show1.id,
      artistId: andyShauf.id,
      position: 0
    })

    await ShowArtist.insert({
      showId: show1.id,
      artistId: bornRuffians.id,
      position: 1
    })

    await ShowArtist.insert({
      showId: show2.id,
      artistId: localNatives.id,
      position: 1
    })
  })

  it("can be queried for a city's show listings", async () => {
    const query = `
      {
        showsForCity (cityId: ${city.id}) {
          day
          venue { name }
          artists { name }
        }
      }
    `

    const { body } = await request(app)
      .post('/graphql')
      .send({ query })

    expect(body).to.matchSnapshot()
  })
})
