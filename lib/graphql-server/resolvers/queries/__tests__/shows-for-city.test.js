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

    city = await City.create(cityFactory())
    venue = await Venue.create(venueFactory({ cityId: city.id }))

    // create shows for a different city
    const otherCity = await City.create(cityFactory())
    const otherVenue = await Venue.create(venueFactory({ cityId: otherCity.id }))
    await Show.insert(showFactory({ venueId: otherVenue.id }))
  })

  it('returns an empty array if no shows exist for the city', async () => {
    expect(
      await resolve(showsForCityResolver, undefined, { cityId: city.id })
    ).to.deep.equal([])
  })

  it('returns the shows for the city', async () => {
    const shows = await Promise.all(times(3, n => {
      return Show.create(showFactory({ venueId: venue.id }))
    }))

    expect(
      await resolve(showsForCityResolver, undefined, { cityId: city.id })
    ).to.deep.equal(sortBy(shows, 'day'))
  })
})
