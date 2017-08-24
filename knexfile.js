const { DATABASE_URL } = require('config')

module.exports = {
  client: 'pg',
  connection: DATABASE_URL,
  migrations: {
    directory: './db/migrations'
  }
}
