const BaseModel = require('./base')

class Artist extends BaseModel {
  static get tableName () {
    return 'artists'
  }
}

module.exports = Artist
