/* eslint-env mocha */

const { DateTime } = require('luxon')
const {
  Conversation,
  ConversationParticipant,
  ChatMessage,
  User
} = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { fixture, truncate } = require('test-helpers')
const ConversationResolver = require('../conversation')

describe('graphql-server/resolvers/types/conversation', () => {
  let conversation

  beforeEach(async () => {
    await truncate([
      Conversation,
      ConversationParticipant,
      ChatMessage,
      User
    ])
    conversation = await fixture(Conversation)
  })

  describe('participants', () => {
    it('returns an empty array if there are no participants', async () => {
      expect(
        await resolve(ConversationResolver.participants, conversation)
      ).to.deep.equal([])
    })

    it('returns the participants', async () => {
      const users = await Promise.all([
        fixture(User),
        fixture(User)
      ])

      await fixture(ConversationParticipant, {
        conversationId: conversation.id,
        userId: users[0].id
      })

      await fixture(ConversationParticipant, {
        conversationId: conversation.id,
        userId: users[1].id
      })

      expect(
        await resolve(ConversationResolver.participants, conversation)
      ).to.deep.equal(users)
    })
  })

  describe('messages', () => {
    describe('no messages', () => {
      it('returns an empty array', async () => {
        expect(
          await resolve(ConversationResolver.messages, conversation)
        ).to.deep.equal([])
      })
    })

    describe('messages exist', () => {
      let messages

      beforeEach(async () => {
        const user = await fixture(User)

        messages = await Promise.all([
          fixture(ChatMessage, {
            conversationId: conversation.id,
            userId: user.id,
            createdAt: DateTime.local().minus({ days: 4 })
          }),
          fixture(ChatMessage, {
            conversationId: conversation.id,
            userId: user.id,
            createdAt: DateTime.local().minus({ days: 3 })
          }),
          fixture(ChatMessage, {
            conversationId: conversation.id,
            userId: user.id,
            createdAt: DateTime.local().minus({ days: 6 })
          })
        ])
      })

      it('returns the chat messages ordered by most recent', async () => {
        expect(
          await resolve(ConversationResolver.messages, conversation)
        ).to.deep.equal([messages[1], messages[0], messages[2]])
      })

      it('can limit the nuber of results', async () => {
        expect(
          await resolve(ConversationResolver.messages, conversation, { first: 2 })
        ).to.deep.equal([messages[1], messages[0]])
      })
    })
  })
})
