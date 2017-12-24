const BaseModel = require('./base')

class ArtistGenre extends BaseModel {
  static get tableName () {
    return 'artist_genres'
  }

  static get idColumn () {
    return ['artist_id', 'genre_id']
  }
}

module.exports = ArtistGenre
