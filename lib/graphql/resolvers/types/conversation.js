const { ChatMessage, User } = require('lib/db/models')

module.exports = {
  participants (conversation, args, context, info) {
    return User.query()
      .join('conversation_participants', 'users.id', 'conversation_participants.user_id')
      .where('conversation_participants.conversation_id', conversation.id)
      .orderBy('conversation_participants.created_at', 'asc')
  },

  messages (conversation, args, context, info) {
    return ChatMessage.query()
      .where('conversation_id', conversation.id)
      .orderBy('created_at', 'desc')
      .modify(query => {
        if (args.first !== undefined) {
          query.limit(args.first)
        }
      })
  }
}
