/* eslint-env jest */

const request = require('supertest')
const app = require('lib/app').listen()
const {
  Artist,
  City,
  Show,
  Venue,
  ShowArtist
} = require('lib/db/models')
const { truncateModel } = require('test-helpers')

let city

beforeEach(async () => {
  await Promise.all([
    ShowArtist,
    Artist,
    City,
    Show,
    Venue
  ].map(truncateModel))

  city = await City.query()
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

  const show1 = await Show.query()
    .insert({
      venueId: venue.id,
      day: '2018-05-01'
    })
    .returning('*')

  const show2 = await Show.query()
    .insert({
      venueId: venue.id,
      day: '2018-05-05'
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

  const localNatives = await Artist.query()
    .insert({
      name: 'Local Natives',
      cityId: city.id
    })
    .returning('*')

  await ShowArtist.query().insert({
    showId: show1.id,
    artistId: andyShauf.id,
    position: 0
  })

  await ShowArtist.query().insert({
    showId: show1.id,
    artistId: bornRuffians.id,
    position: 1
  })

  await ShowArtist.query().insert({
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

  expect(body).toMatchSnapshot()
})
