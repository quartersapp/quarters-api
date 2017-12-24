/* eslint-env jest */

const { City, Venue } = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { truncateModel } = require('test-helpers')
const { cityFactory, venueFactory } = require('test-helpers/factories')
const VenueResolver = require('../venue')

let city, venue

beforeEach(async () => {
  await Promise.all([City, Venue].map(truncateModel))

  city = await City.query().insert(cityFactory()).returning('*')
  venue = await Venue.query().insert(venueFactory({ cityId: city.id })).returning('*')
})

describe('city', () => {
  it('returns the city', async () => {
    expect(await resolve(VenueResolver.city, venue)).toEqual(city)
  })
})
