const {
  DATABASE: {
    HOST,
    USER,
    PASSWORD,
    DATABASE
  },
  LOGGER: { PRETTIFY_DB_QUERIES }
} = require('config')
const pg = require('pg')
const log = require('lib/logger')
const sqlFormatter = require('sql-formatter')
const DATE_OID = 1082

pg.types.setTypeParser(DATE_OID, val => val)

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
  }
})

if (log.trace()) {
  knex.on('query', query => {
    let sql = query.sql

    if (PRETTIFY_DB_QUERIES) {
      sql = sqlFormatter.format(sql)
    }

    log.trace({ type: 'db_query' }, `${sql}; ${query.bindings.join(', ')}`)
  })
}

module.exports = knex
