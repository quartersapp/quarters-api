const { Artist, City, Show, User, Venue } = require('lib/db/models')
const modelById = require('./model-by-id')
const DataLoader = require('dataloader')

module.exports = () => {
  return {
    artistById: modelById(Artist),
    cityById: modelById(City),
    conversationParticipants: new DataLoader(User.findParticipantsForConversations),
    showById: modelById(Show),
    showArtists: new DataLoader(Artist.findForShows),
    userById: modelById(User),
    venueById: modelById(Venue)
  }
}
