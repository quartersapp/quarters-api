const { Show } = require('lib/db/models')

module.exports = async (obj, args, ctx, info) => {
  return Show.query()
    .join('venues', 'venues.id', 'shows.venue_id')
    .where('venues.city_id', args.cityId)
    .orderBy('shows.day', 'asc')
}
