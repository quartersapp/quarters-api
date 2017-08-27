const { User } = require('../models')
const modelById = require('./model-by-id')

module.exports = () => {
  return {
    userById: modelById(User)
  }
}
