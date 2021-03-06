const { Genre, Show } = require('lib/db/models')

module.exports = {
  city: async (artist, args, ctx, info) => {
    return ctx.loaders.cityById.load(artist.cityId)
  },

  genres: async (artist, args, ctx, info) => {
    return Genre.query()
      .join('artist_genres', 'genres.id', 'artist_genres.genre_id')
      .where('artist_genres.artist_id', artist.id)
      .orderBy('artist_genres.position', 'asc')
      .orderBy('genres.name', 'asc')
  },

  shows: async (artist, args, ctx, info) => {
    return Show.query()
      .join('show_artists', 'show_artists.show_id', 'shows.id')
      .where('show_artists.artist_id', artist.id)
      .orderBy('shows.day', 'asc')
  }
}
