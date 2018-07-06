/* eslint-env mocha */

const { City, Venue } = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { fixture, truncate } = require('test-helpers')
const VenueResolver = require('../venue')

describe('graphql-server/resolvers/types/venue', () => {
  let city, venue

  beforeEach(async () => {
    await truncate([City, Venue])

    city = await fixture(City)
    venue = await fixture(Venue, { cityId: city.id })
  })

  describe('city', () => {
    it('returns the city', async () => {
      expect(await resolve(VenueResolver.city, venue)).to.deep.equal(city)
    })
  })
})
