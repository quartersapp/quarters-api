const { DATABASE_URL } = require('config')

module.exports = require('knex')({
  client: 'pg',
  connection: DATABASE_URL
})
