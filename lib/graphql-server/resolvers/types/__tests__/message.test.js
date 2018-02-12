/* eslint-env mocha */

const { Conversation, ChatMessage, User } = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { truncateModel } = require('test-helpers')
const {
  conversationFactory,
  chatMessageFactory,
  userFactory
} = require('test-helpers/factories')
const MessageResolver = require('../message')

describe('graphql-server/resolvers/types/message', () => {
  let chatMessage, user

  beforeEach(async () => {
    await Promise.all([
      Conversation,
      ChatMessage,
      User
    ].map(truncateModel))

    user = await User.create(userFactory())
    const conversation = await Conversation.create(conversationFactory())
    chatMessage = await ChatMessage.create(chatMessageFactory({
      userId: user.id,
      conversationId: conversation.id
    }))
  })

  describe('author', () => {
    it('returns the author', async () => {
      expect(await resolve(MessageResolver.author, chatMessage)).to.deep.equal(user)
    })
  })

  describe('sentAt', () => {
    it('returns the date that the record was created', async () => {
      expect(resolve(MessageResolver.sentAt, chatMessage)).to.equal(chatMessage.createdAt)
    })
  })
})
