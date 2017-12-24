const { raw } = require('objection')
const DataLoader = require('dataloader')
const { omit } = require('lodash/fp')
const { Artist } = require('lib/db/models')

module.exports = () => new DataLoader(async showIds => {
  const artists = await Artist.query()
    .select(raw('artists.*, show_artists.show_id as show_id'))
    .join('show_artists', 'artists.id', 'show_artists.artist_id')
    .whereIn('show_artists.show_id', showIds)
    .orderBy('show_artists.show_id', 'asc')
    .orderBy('show_artists.position', 'asc')

  return showIds.map(id => {
    return artists
      .filter(artist => artist.showId === id)
      .map(omit('showId'))
  })
})
