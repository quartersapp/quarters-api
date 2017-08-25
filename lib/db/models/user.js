const BaseModel = require('./base')

class User extends BaseModel {
  static get tableName () {
    return 'users'
  }
}

module.exports = User
