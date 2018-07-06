/* eslint-env mocha */

const { times } = require('lodash')
const { resolve } = require('../../test-helpers')
const { fixture, truncate } = require('test-helpers')
const {
  Conversation,
  ConversationParticipant,
  ChatMessage,
  User
} = require('lib/db/models')
const conversationsResolver = require('../conversations')
const { DateTime } = require('luxon')

describe('graphql-server/resolvers/queries/conversations', () => {
  describe('not authenticated', () => {
    it('returns null', async () => {
      expect(await resolve(conversationsResolver)).to.equal(null)
    })
  })

  describe('authenticated', () => {
    let user

    beforeEach(async () => {
      await truncate([Conversation, ChatMessage, ConversationParticipant, User])
      user = await fixture(User)
    })

    it('returns an empty array if the user is not a participant of any conversations', async () => {
      expect(await resolve(conversationsResolver, undefined, undefined, user.id)).to.deep.equal([])
    })

    it('returns conversations ordered by most recent chat message', async () => {
      const conversations = await Promise.all(times(3, () => {
        return fixture(Conversation)
      }))

      await Promise.all([
        Promise.all(conversations.map(conversation => {
          return fixture(ConversationParticipant, {
            user_id: user.id,
            conversation_id: conversation.id
          })
        })),
        Promise.all([
          // first chat message has no chat messages, but was created after each
          // of the messages so it should be ordered as most recent
          fixture(ChatMessage, {
            conversationId: conversations[1].id,
            userId: user.id,
            createdAt: DateTime.local().minus({ days: 6 }).toJSDate()
          }),
          fixture(ChatMessage, {
            conversationId: conversations[1].id,
            userId: user.id,
            createdAt: DateTime.local().minus({ days: 4 }).toJSDate()
          }),
          fixture(ChatMessage, {
            conversationId: conversations[2].id,
            userId: user.id,
            createdAt: DateTime.local().minus({ days: 5 }).toJSDate()
          })
        ])
      ])

      expect(
        await resolve(conversationsResolver, undefined, undefined, user.id)
      ).to.deep.equal(conversations)
    })
  })
})
