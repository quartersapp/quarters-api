/* eslint-env mocha */

const { truncateModel } = require('test-helpers')
const { resolve } = require('../../test-helpers')
const conversationResolver = require('../conversation')
const {
  conversationFactory,
  userFactory
} = require('test-helpers/factories')
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
      await Promise.all([Conversation, ConversationParticipant, User].map(truncateModel))
      user = await User.create(userFactory()).returning('*')
      conversation = await Conversation.create(conversationFactory())
    })

    it('returns null if the user is not a participant of the conversation', async () => {
      expect(
        await resolve(conversationResolver, undefined, { id: conversation.id }, user.id)
      ).to.equal(null)
    })

    it('returns the conversation id the user is a participant', async () => {
      await ConversationParticipant.insert({
        userId: user.id,
        conversationId: conversation.id
      })

      expect(
        await resolve(conversationResolver, undefined, { id: conversation.id }, user.id)
      ).to.deep.equal(conversation)
    })
  })
})
