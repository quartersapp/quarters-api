const BaseModel = require('./base')

class Venue extends BaseModel {
  static get tableName () {
    return 'venues'
  }
}

module.exports = Venue
