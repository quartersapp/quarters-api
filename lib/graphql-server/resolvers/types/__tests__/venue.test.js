/* eslint-env mocha */

const { City, Venue } = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { truncateModel } = require('test-helpers')
const { cityFactory, venueFactory } = require('test-helpers/factories')
const VenueResolver = require('../venue')

describe('graphql-server/resolvers/types/venue', () => {
  let city, venue

  beforeEach(async () => {
    await Promise.all([City, Venue].map(truncateModel))

    city = await City.create(cityFactory())
    venue = await Venue.create(venueFactory({ cityId: city.id }))
  })

  describe('city', () => {
    it('returns the city', async () => {
      expect(await resolve(VenueResolver.city, venue)).to.deep.equal(city)
    })
  })
})
