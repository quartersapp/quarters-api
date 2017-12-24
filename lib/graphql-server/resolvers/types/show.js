module.exports = {
  artists: async (show, args, ctx, info) => {
    return ctx.loaders.showArtists.load(show.id)
  },

  venue: async (show, args, ctx, info) => {
    return ctx.loaders.venueById.load(show.venueId)
  }
}
