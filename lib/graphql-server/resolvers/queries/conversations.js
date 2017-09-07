const { raw } = require('objection')
const { omit } = require('lodash/fp')
const { Conversation } = require('lib/db/models')

module.exports = async (obj, args, context, info) => {
  if (!context.userId) return null

  const conversations = await Conversation.query()
    .select(raw('conversations.*, coalesce(max(chat_messages.created_at), conversations.created_at) as most_recent_message_sent_at'))
    .join('conversation_participants', 'conversation_participants.conversation_id', 'conversations.id')
    .leftJoin('chat_messages', 'chat_messages.conversation_id', 'conversations.id')
    .where('conversation_participants.user_id', context.userId)
    .groupBy('conversations.id')
    .orderByRaw('most_recent_message_sent_at desc')

  return conversations.map(omit('mostRecentMessageSentAt'))
}
