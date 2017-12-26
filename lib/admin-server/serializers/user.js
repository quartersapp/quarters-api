const { omit } = require('lodash')

module.exports = user => {
  return omit(user, ['passwordHash'])
}
