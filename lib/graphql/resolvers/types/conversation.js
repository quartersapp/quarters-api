const { ChatMessage } = require('lib/db/models')

module.exports = {
  participants: async (conversation, args, context, info) => {
    return context.loaders.conversationParticipants.load(conversation.id)
  },

  messages: async (conversation, args, context, info) => {
    const chatMessages = await ChatMessage.query()
      .where('conversation_id', conversation.id)
      .orderBy('created_at', 'desc')
      .modify(query => {
        if (args.first !== undefined) {
          query.limit(args.first)
        }
      })

    return chatMessages
  }
}
