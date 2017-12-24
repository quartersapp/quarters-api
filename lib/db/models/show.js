const BaseModel = require('./base')

class Show extends BaseModel {
  static get tableName () {
    return 'shows'
  }
}

module.exports = Show
