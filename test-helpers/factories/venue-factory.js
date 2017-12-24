const faker = require('faker')
const { random } = require('lodash')
const createFactory = require('./create-factory')

const venueNames = [
  'Mod Club Theatre',
  'Danforth Music Hall',
  'Smiling Buddha',
  'Horseshoe Tavern'
]

module.exports = createFactory({
  name: () => venueNames[random(0, venueNames.length - 1)],
  googlePlaceId: faker.random.uuid
})
