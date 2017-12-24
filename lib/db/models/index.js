const { Model } = require('objection')
const knex = require('../connection')

Model.knex(knex)

module.exports = {
  Artist: require('./artist'),
  ArtistGenre: require('./artist-genre'),
  ChatMessage: require('./chat-message'),
  City: require('./city'),
  Conversation: require('./conversation'),
  ConversationParticipant: require('./conversation-participant'),
  Genre: require('./genre'),
  Show: require('./show'),
  ShowArtist: require('./show-artist'),
  User: require('./user'),
  Venue: require('./venue')
}
