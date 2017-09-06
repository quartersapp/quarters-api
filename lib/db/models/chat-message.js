const BaseModel = require('./base')

class ChatMessage extends BaseModel {
  static get tableName () {
    return 'chat_messages'
  }
}

module.exports = ChatMessage
