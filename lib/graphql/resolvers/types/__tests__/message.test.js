/* eslint-env jest */

const { Conversation, ChatMessage, User } = require('lib/db/models')
const { resolve, truncateModel } = require('test-helpers')
const {
  conversationFactory,
  chatMessageFactory,
  userFactory
} = require('test-helpers/factories')
const MessageResolver = require('../message')

let chatMessage, user

beforeEach(async () => {
  await [
    Conversation,
    ChatMessage,
    User
  ].map(truncateModel)

  user = await User.query().insert(userFactory()).returning('*')
  const conversation = await Conversation.query().insert(conversationFactory()).returning('*')
  chatMessage = await ChatMessage
    .query()
    .insert(chatMessageFactory({
      userId: user.id,
      conversationId: conversation.id
    }))
    .returning('*')
})

describe('author', () => {
  it('returns the author', async () => {
    expect(await resolve(MessageResolver.author, chatMessage)).toEqual(user)
  })
})

describe('sentAt', () => {
  it('returns the date that the record was created', async () => {
    expect(resolve(MessageResolver.sentAt, chatMessage)).toEqual(chatMessage.createdAt)
  })
})
