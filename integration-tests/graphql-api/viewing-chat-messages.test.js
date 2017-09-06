/* eslint-env jest */

const moment = require('moment')
const request = require('supertest')
const MockDate = require('mockdate')
const app = require('lib/app').listen()
const {
  Conversation,
  ChatMessage,
  ConversationParticipant,
  User
} = require('lib/db/models')
const { truncateModel } = require('test-helpers')
const { userFactory } = require('test-helpers/factories')
const { encode } = require('lib/auth/token-service')

let user

MockDate.set(new Date(1504659609251))

beforeEach(async () => {
  await Promise.all([
    Conversation,
    ChatMessage,
    ConversationParticipant,
    User
  ].map(truncateModel))

  user = await User
    .query()
    .insert(userFactory({
      id: 12345,
      firstName: 'John',
      lastName: 'Smith'
    }))
    .returning('*')

  const user2 = await User
    .query()
    .insert(userFactory({
      id: 23456,
      firstName: 'Jane',
      lastName: 'Doe'
    }))
    .returning('*')

  // create conversation
  const conversation = await Conversation.query().insert({}).returning('*')

  // create participants
  await ConversationParticipant.query().insert({
    conversationId: conversation.id,
    userId: user.id
  })

  await ConversationParticipant.query().insert({
    conversationId: conversation.id,
    userId: user2.id
  })

  const createMessage = (user, body, date) => {
    return ChatMessage.query().insert({
      conversationId: conversation.id,
      userId: user.id,
      body,
      createdAt: date
    })
  }

  // create chat messages
  await createMessage(user, 'Hello!', moment().subtract(3, 'minutes').toDate())
  await createMessage(user2, 'Whatsup?', moment().subtract(2, 'minute').toDate())
  await createMessage(user, 'Not much!', moment().subtract(1, 'minute').toDate())
})

it("can be queried for the current user's conversations", async () => {
  const token = encode({ userId: user.id })

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

  expect(body).toMatchSnapshot()
})
