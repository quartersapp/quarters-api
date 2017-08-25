const bunyan = require('bunyan')
const { LOGGER: { LEVEL } } = require('config')

module.exports = bunyan.createLogger({
  name: 'quarters-api',
  level: LEVEL
})
