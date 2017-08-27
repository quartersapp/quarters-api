const {
  DATABASE: {
    HOST,
    USER,
    PASSWORD,
    DATABASE
  }
} = require('config')

module.exports = {
  client: 'pg',
  connection: {
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
  },
  migrations: {
    directory: './db/migrations'
  }
}
