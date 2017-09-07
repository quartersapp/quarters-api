const bcrypt = require('bcryptjs')
const { AUTH: { PASSWORD_SALT_ROUNDS: SALT_ROUNDS } } = require('config')

module.exports = {
  hash: plaintextPassword => bcrypt.hash(plaintextPassword, SALT_ROUNDS),
  hashSync: plaintextPassword => bcrypt.hashSync(plaintextPassword, SALT_ROUNDS),
  compare: (password, hash) => bcrypt.compare(password, hash)
}
