const { Conversation } = require('lib/db/models')

module.exports = async (obj, args, ctx, info) => {
  if (!ctx.state.userId) return null

  const conversation = await Conversation.query()
    .join('conversation_participants', 'conversation_participants.conversation_id', 'conversations.id')
    .where('conversation_participants.user_id', ctx.state.userId)
    .andWhere('conversations.id', args.id)
    .first()

  return conversation || null
}
