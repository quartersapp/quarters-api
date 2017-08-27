const {
  DATABASE: {
    HOST,
    USER,
    PASSWORD,
    DATABASE
  }
} = require('config')

module.exports = require('knex')({
  client: 'pg',
  connection: {
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
  }
})
