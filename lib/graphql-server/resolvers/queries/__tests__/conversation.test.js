/* eslint-env mocha */

const { fixture, truncate } = require('test-helpers')
const { resolve } = require('../../test-helpers')
const conversationResolver = require('../conversation')
const {
  Conversation,
  ConversationParticipant,
  User
} = require('lib/db/models')

describe('graphql-server/resolvers/queries/conversation', () => {
  describe('not authenticated', () => {
    it('returns null', async () => {
      expect(await resolve(conversationResolver)).to.equal(null)
    })
  })

  describe('authenticated', () => {
    let conversation, user

    beforeEach(async () => {
      await truncate([Conversation, ConversationParticipant, User])
      user = await fixture(User).returning('*')
      conversation = await fixture(Conversation)
    })

    it('returns null if the user is not a participant of the conversation', async () => {
      expect(
        await resolve(conversationResolver, undefined, { id: conversation.id }, user.id)
      ).to.equal(null)
    })

    it('returns the conversation id the user is a participant', async () => {
      await fixture(ConversationParticipant, {
        userId: user.id,
        conversationId: conversation.id
      })

      expect(
        await resolve(conversationResolver, undefined, { id: conversation.id }, user.id)
      ).to.deep.equal(conversation)
    })
  })
})
