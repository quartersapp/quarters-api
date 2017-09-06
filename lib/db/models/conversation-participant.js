const BaseModel = require('./base')

class ConversationParticipant extends BaseModel {
  static get tableName () {
    return 'conversation_participants'
  }
}

module.exports = ConversationParticipant
