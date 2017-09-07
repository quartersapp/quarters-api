/* eslint-env jest */

const moment = require('moment')
const {
  Conversation,
  ConversationParticipant,
  ChatMessage,
  User
} = require('lib/db/models')
const {
  conversationFactory,
  chatMessageFactory,
  userFactory
} = require('test-helpers/factories')
const { resolve } = require('../../test-helpers')
const { truncateModel } = require('test-helpers')
const ConversationResolver = require('../conversation')

let conversation

beforeEach(async () => {
  await Promise.all([
    Conversation,
    ConversationParticipant,
    ChatMessage,
    User
  ].map(truncateModel))
  conversation = await Conversation.query().insert(conversationFactory())
})

describe('participants', () => {
  it('returns an empty array if there are no participants', async () => {
    expect(
      await resolve(ConversationResolver.participants, conversation)
    ).toEqual([])
  })

  it('returns the participants', async () => {
    const users = await Promise.all([
      User.query().insert(userFactory()).returning('*'),
      User.query().insert(userFactory()).returning('*')
    ])

    await ConversationParticipant.query().insert({
      conversationId: conversation.id,
      userId: users[0].id
    })

    await ConversationParticipant.query().insert({
      conversationId: conversation.id,
      userId: users[1].id
    })

    expect(
      await resolve(ConversationResolver.participants, conversation)
    ).toEqual(users)
  })
})

describe('messages', () => {
  describe('no messages', () => {
    it('returns an empty array', async () => {
      expect(
        await resolve(ConversationResolver.messages, conversation)
      ).toEqual([])
    })
  })

  describe('messages exist', () => {
    let messages

    beforeEach(async () => {
      const user = await User.query().insert(userFactory()).returning('*')

      messages = await Promise.all([
        ChatMessage.query().insert(chatMessageFactory({
          conversationId: conversation.id,
          userId: user.id,
          createdAt: moment().subtract(4, 'days')
        })).returning('*'),
        ChatMessage.query().insert(chatMessageFactory({
          conversationId: conversation.id,
          userId: user.id,
          createdAt: moment().subtract(3, 'days')
        })).returning('*'),
        ChatMessage.query().insert(chatMessageFactory({
          conversationId: conversation.id,
          userId: user.id,
          createdAt: moment().subtract(6, 'days')
        })).returning('*')
      ])
    })

    it('returns the chat messages ordered by most recent', async () => {
      expect(
        await resolve(ConversationResolver.messages, conversation)
      ).toEqual([messages[1], messages[0], messages[2]])
    })

    it('can limit the nuber of results', async () => {
      expect(
        await resolve(ConversationResolver.messages, conversation, { first: 2 })
      ).toEqual([messages[1], messages[0]])
    })
  })
})
