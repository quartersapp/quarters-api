const { Model } = require('objection')
const BaseModel = require('./base')

class Conversation extends BaseModel {
  static get tableName () {
    return 'conversations'
  }

  static get relationMappings () {
    const User = require('./user')

    return {
      participants: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'conversations.id',
          through: {
            from: 'conversation_participants.conversations_id',
            to: 'conversation_participants.user_id'
          },
          to: 'users.id'
        }
      }
    }
  }
}

module.exports = Conversation
