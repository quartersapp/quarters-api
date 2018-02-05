/* eslint-env mocha */

const { truncateModel } = require('test-helpers')
const { resolve } = require('../../test-helpers')
const showResolver = require('../show')
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

describe('graphql-server/resolvers/queries/show', () => {
  let show

  beforeEach(async () => {
    await Promise.all([Show, City, Venue].map(truncateModel))

    const city = await City.query().insert(cityFactory()).returning('*')
    const venue = await Venue.query().insert(venueFactory({ cityId: city.id })).returning('*')
    show = await Show.query().insert(showFactory({ venueId: venue.id })).returning('*')
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
