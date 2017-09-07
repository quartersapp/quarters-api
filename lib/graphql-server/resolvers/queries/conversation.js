const { Conversation } = require('lib/db/models')

module.exports = async (obj, args, context, info) => {
  if (!context.userId) return null

  const conversation = await Conversation.query()
    .join('conversation_participants', 'conversation_participants.conversation_id', 'conversations.id')
    .where('conversation_participants.user_id', context.userId)
    .andWhere('conversations.id', args.id)
    .first()

  return conversation || null
}
