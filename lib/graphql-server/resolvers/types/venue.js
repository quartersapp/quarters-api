module.exports = {
  city: async (venue, args, ctx, info) => {
    return ctx.loaders.cityById.load(venue.cityId)
  }
}
