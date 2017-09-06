const { Model } = require('objection')
const knex = require('../connection')

Model.knex(knex)

module.exports = {
  ChatMessage: require('./chat-message'),
  Conversation: require('./conversation'),
  ConversationParticipant: require('./conversation-participant'),
  User: require('./user')
}
