/* eslint-env mocha */

const { times, sortBy } = require('lodash')
const { truncateModel } = require('test-helpers')
const { resolve } = require('../../test-helpers')
const showsForCityResolver = require('../shows-for-city')
const {
  cityFactory,
  showFactory,
  venueFactory
} = require('test-helpers/factories')
const {
  City,
  Venue,
  Show
} = require('lib/db/models')

describe('graphql-server/resolvers/queries/shows-for-city', () => {
  let city, venue

  beforeEach(async () => {
    await Promise.all([Show, City, Venue].map(truncateModel))

    city = await City.query().insert(cityFactory()).returning('*')
    venue = await Venue.query().insert(venueFactory({ cityId: city.id })).returning('*')

    // create shows for a different city
    const otherCity = await City.query().insert(cityFactory()).returning('*')
    const otherVenue = await Venue.query().insert(venueFactory({ cityId: otherCity.id })).returning('*')
    await Show.query().insert(showFactory({ venueId: otherVenue.id })).returning('*')
  })

  it('returns an empty array if no shows exist for the city', async () => {
    expect(
      await resolve(showsForCityResolver, undefined, { cityId: city.id })
    ).to.deep.equal([])
  })

  it('returns the shows for the city', async () => {
    const shows = await Promise.all(times(3, n => {
      return Show.query().insert(showFactory({ venueId: venue.id })).returning('*')
    }))

    expect(
      await resolve(showsForCityResolver, undefined, { cityId: city.id })
    ).to.deep.equal(sortBy(shows, 'day'))
  })
})
