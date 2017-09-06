const {
  DATABASE: {
    HOST,
    USER,
    PASSWORD,
    DATABASE
  },
  LOGGER: { PRETTIFY_DB_QUERIES }
} = require('config')
const { log } = require('lib/logger/index')
const sqlFormatter = require('sql-formatter')

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
  let sql = query.sql

  if (PRETTIFY_DB_QUERIES) {
    sql = sqlFormatter.format(sql)
  }

  log.trace({ type: 'db_query' }, `${sql}; ${query.bindings.join(', ')}`)
})

module.exports = knex
