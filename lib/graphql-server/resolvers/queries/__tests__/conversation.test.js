/* eslint-env jest */

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

describe('not authenticated', () => {
  it('returns null', async () => {
    expect(await resolve(conversationResolver)).toBeNull()
  })
})

describe('authenticated', () => {
  let conversation, user

  beforeEach(async () => {
    await Promise.all([Conversation, ConversationParticipant, User].map(truncateModel))
    user = await User.query().insert(userFactory()).returning('*')
    conversation = await Conversation.query().insert(conversationFactory()).returning('*')
  })

  it('returns null if the user is not a participant of the conversation', async () => {
    expect(
      await resolve(conversationResolver, undefined, { id: conversation.id }, user.id)
    ).toBeNull()
  })

  it('returns the conversation id the user is a participant', async () => {
    await ConversationParticipant.query().insert({
      userId: user.id,
      conversationId: conversation.id
    })

    expect(
      await resolve(conversationResolver, undefined, { id: conversation.id }, user.id)
    ).toEqual(conversation)
  })
})
