const { raw } = require('objection')
const DataLoader = require('dataloader')
const { omit } = require('lodash/fp')
const { User } = require('lib/db/models')

module.exports = () => new DataLoader(async conversationIds => {
  const users = await User.query()
    .select(raw('users.*, conversation_participants.conversation_id as conversation_id'))
    .join('conversation_participants', 'users.id', 'conversation_participants.user_id')
    .whereIn('conversation_participants.conversation_id', conversationIds)
    .orderBy('conversation_participants.created_at', 'asc')

  return conversationIds.map(id => {
    return users
      .filter(user => user.conversationId === id)
      .map(omit('conversationId'))
  })
})
