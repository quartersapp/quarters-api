const BaseModel = require('./base')

class ShowArtist extends BaseModel {
  static get tableName () {
    return 'show_artists'
  }

  static get idColumn () {
    return ['show_id', 'artist_id']
  }
}

module.exports = ShowArtist
