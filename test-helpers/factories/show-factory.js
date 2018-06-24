const faker = require('faker')
const { DateTime } = require('luxon')
const createFactory = require('./create-factory')

module.exports = createFactory({
  day: () => DateTime.fromJSDate(faker.date.future()).toISODate('YYYY-MM-DD')
})
