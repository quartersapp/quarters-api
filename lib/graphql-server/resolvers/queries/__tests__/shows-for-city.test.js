/* eslint-env mocha */

const { times, sortBy } = require('lodash')
const { fixture, truncate } = require('test-helpers')
const { resolve } = require('../../test-helpers')
const showsForCityResolver = require('../shows-for-city')
const {
  City,
  Venue,
  Show
} = require('lib/db/models')

describe('graphql-server/resolvers/queries/shows-for-city', () => {
  let city, venue

  beforeEach(async () => {
    await truncate([Show, City, Venue])

    city = await fixture(City)
    venue = await fixture(Venue, { cityId: city.id })

    // create shows for a different city
    const otherCity = await fixture(City)
    const otherVenue = await fixture(Venue, { cityId: otherCity.id })
    await fixture(Show, { venueId: otherVenue.id })
  })

  it('returns an empty array if no shows exist for the city', async () => {
    expect(
      await resolve(showsForCityResolver, undefined, { cityId: city.id })
    ).to.deep.equal([])
  })

  it('returns the shows for the city', async () => {
    const shows = await Promise.all(times(3, n => {
      return fixture(Show, { venueId: venue.id })
    }))

    expect(
      await resolve(showsForCityResolver, undefined, { cityId: city.id })
    ).to.deep.equal(sortBy(shows, 'day'))
  })
})
