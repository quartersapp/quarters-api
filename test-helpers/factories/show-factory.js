const faker = require('faker')
const moment = require('moment')
const createFactory = require('./create-factory')

module.exports = createFactory({
  day: () => moment(faker.date.future()).format('YYYY-MM-DD')
})
