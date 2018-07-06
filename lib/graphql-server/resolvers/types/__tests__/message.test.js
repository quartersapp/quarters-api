/* eslint-env mocha */

const { Conversation, ChatMessage, User } = require('lib/db/models')
const { resolve } = require('../../test-helpers')
const { fixture, truncate } = require('test-helpers')
const MessageResolver = require('../message')

describe('graphql-server/resolvers/types/message', () => {
  let chatMessage, user

  beforeEach(async () => {
    await truncate([
      Conversation,
      ChatMessage,
      User
    ])

    user = await fixture(User)
    const conversation = await fixture(Conversation)
    chatMessage = await fixture(ChatMessage, {
      userId: user.id,
      conversationId: conversation.id
    })
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
