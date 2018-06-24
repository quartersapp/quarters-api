/* eslint-env mocha */

const { DateTime } = require('luxon')
const request = require('supertest')
const MockDate = require('mockdate')
const app = require('lib/app').listen()
const {
  Conversation,
  ChatMessage,
  ConversationParticipant,
  User
} = require('lib/db/models')
const { truncateModel, enableSnapshots } = require('test-helpers')
const { userFactory } = require('test-helpers/factories')
const { generateToken } = require('lib/services/token-service')

describe('integration-tests/graphql-server/chat', () => {
  let conversation, user

  before(() => MockDate.set(new Date(1504659609251)))
  after(() => MockDate.reset())

  beforeEach(enableSnapshots)

  beforeEach(async () => {
    await Promise.all([
      Conversation,
      ChatMessage,
      ConversationParticipant,
      User
    ].map(truncateModel))

    user = await User.create(userFactory({
      id: 12345,
      firstName: 'John',
      lastName: 'Smith'
    }))

    const user2 = await User.create(userFactory({
      id: 23456,
      firstName: 'Jane',
      lastName: 'Doe'
    }))

    // create conversation
    conversation = await Conversation.create()

    // create participants
    await ConversationParticipant.insert({
      conversationId: conversation.id,
      userId: user.id
    })

    await ConversationParticipant.insert({
      conversationId: conversation.id,
      userId: user2.id
    })

    const createMessage = (user, body, date) => {
      return ChatMessage.insert({
        conversationId: conversation.id,
        userId: user.id,
        body,
        createdAt: date
      })
    }

    // create chat messages
    await createMessage(user, 'Hello!', DateTime.local().minus({ minutes: 3 }).toJSDate())
    await createMessage(user2, 'Whatsup?', DateTime.local().minus({ minutes: 2 }).toJSDate())
    await createMessage(user, 'Not much!', DateTime.local().minus({ minutes: 1 }).toJSDate())
  })

  it("can be queried for the current user's conversations", async () => {
    const token = generateToken(user)

    const query = `
      {
        currentUser {
          id
        }

        conversations {
          participants {
            id, name
          }
          messages (first: 1) {
            author { name },
            body,
            sentAt
          }
        }
      }
    `

    const { body } = await request(app)
      .post('/graphql')
      .set('authorization', `Bearer ${token}`)
      .send({ query })

    expect(body).to.matchSnapshot()
  })

  it('can be queried for a single conversation and its messages', async () => {
    const token = generateToken(user)

    const query = `
      query LoadConversationMessages($conversationId: ID!) {
        currentUser { id }

        conversation(id: $conversationId) {
          participants {
            id, name
          }

          messages {
            body,
            author {
              id,
              name
            },
            sentAt
          }
        }
      }
    `

    const { body } = await request(app)
      .post('/graphql')
      .set('authorization', `Bearer ${token}`)
      .send({
        query,
        variables: { conversationId: conversation.id }
      })

    expect(body).to.matchSnapshot()
  })
})
