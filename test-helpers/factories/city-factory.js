const { address, random } = require('faker')
const createFactory = require('./create-factory')

module.exports = createFactory({
  name: address.city,
  googlePlaceId: random.uuid
})
