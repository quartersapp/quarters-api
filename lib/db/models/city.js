const BaseModel = require('./base')

class City extends BaseModel {
  static get tableName () {
    return 'cities'
  }
}

module.exports = City
