const { User } = require('lib/db/models')
const modelById = require('./model-by-id')
const conversationParticipants = require('./conversation-participants')

module.exports = () => {
  return {
    conversationParticipants: conversationParticipants(),
    userById: modelById(User)
  }
}
