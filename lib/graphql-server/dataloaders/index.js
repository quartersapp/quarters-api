const { City, Show, User, Venue } = require('lib/db/models')
const modelById = require('./model-by-id')
const conversationParticipants = require('./conversation-participants')
const showArtists = require('./show-artists')

module.exports = () => {
  return {
    cityById: modelById(City),
    conversationParticipants: conversationParticipants(),
    showById: modelById(Show),
    showArtists: showArtists(),
    userById: modelById(User),
    venueById: modelById(Venue)
  }
}
