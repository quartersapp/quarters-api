/* eslint-env mocha */

const { fixture, truncate } = require('test-helpers')
const { resolve } = require('../../test-helpers')
const showResolver = require('../show')
const {
  City,
  Venue,
  Show
} = require('lib/db/models')

describe('graphql-server/resolvers/queries/show', () => {
  let show

  beforeEach(async () => {
    await truncate([Show, City, Venue])

    const city = await fixture(City)
    const venue = await fixture(Venue, { cityId: city.id })
    show = await fixture(Show, { venueId: venue.id })
  })

  it('returns null if no show exists', async () => {
    expect(
      await resolve(showResolver, undefined, { id: -1 })
    ).to.equal(null)
  })

  it('returns a show by its id', async () => {
    expect(
      await resolve(showResolver, undefined, { id: show.id })
    ).to.deep.equal(show)
  })
})
