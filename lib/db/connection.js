const {
  DATABASE: {
    HOST,
    USER,
    PASSWORD,
    DATABASE
  }
} = require('config')
const log = require('lib/logger')

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
  }
})

knex.on('query', query => {
  log.info({ type: 'db_query' }, `${query.sql}; ${query.bindings.join(', ')}`)
})

module.exports = knex
