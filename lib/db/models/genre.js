const BaseModel = require('./base')

class Genre extends BaseModel {
  static get tableName () {
    return 'genres'
  }
}

module.exports = Genre
