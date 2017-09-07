/* eslint-env jest */

const { times } = require('lodash')
const { resolve } = require('../../test-helpers')
const { truncateModel } = require('test-helpers')
const {
  conversationFactory,
  chatMessageFactory,
  userFactory
} = require('test-helpers/factories')
const {
  Conversation,
  ConversationParticipant,
  ChatMessage,
  User
} = require('lib/db/models')
const conversationsResolver = require('../conversations')
const moment = require('moment')

describe('not authenticated', () => {
  it('returns null', async () => {
    expect(await resolve(conversationsResolver)).toBeNull()
  })
})

describe('authenticated', () => {
  let user

  beforeEach(async () => {
    await Promise.all([Conversation, ChatMessage, ConversationParticipant, User].map(truncateModel))
    user = await User.query().insert(userFactory()).returning('*')
  })

  it('returns an empty array if the user is not a participant of any conversations', async () => {
    expect(await resolve(conversationsResolver, undefined, undefined, user.id)).toEqual([])
  })

  it('returns conversations ordered by most recent chat message', async () => {
    const conversations = await Promise.all(times(3, () => {
      return Conversation.query().insert(conversationFactory()).returning('*')
    }))

    await Promise.all([
      Promise.all(conversations.map(conversation => {
        return ConversationParticipant.query().insert({
          user_id: user.id,
          conversation_id: conversation.id
        })
      })),
      Promise.all([
        // first chat message has no chat messages, but was created after each
        // of the messages so it should be ordered as most recent
        ChatMessage.query().insert(chatMessageFactory({
          conversationId: conversations[1].id,
          userId: user.id,
          createdAt: moment().subtract('6', 'days')
        })),
        ChatMessage.query().insert(chatMessageFactory({
          conversationId: conversations[1].id,
          userId: user.id,
          createdAt: moment().subtract('4', 'days')
        })),
        ChatMessage.query().insert(chatMessageFactory({
          conversationId: conversations[2].id,
          userId: user.id,
          createdAt: moment().subtract('5', 'days')
        }))
      ])
    ])

    expect(
      await resolve(conversationsResolver, undefined, undefined, user.id)
    ).toEqual(conversations)
  })
})
