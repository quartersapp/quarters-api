/* eslint-env jest */

const request = require('supertest')
const app = require('lib/app').listen()
const { User } = require('lib/db/models')
const { userFactory } = require('test-helpers/factories')
const { encode } = require('lib/auth/token-service')

let user

beforeEach(async () => {
  await User.query().truncate()
  user = await User
    .query()
    .insert(userFactory({
      id: 12345,
      email: 'test@example.com'
    }))
})

it('can be queried for the current user', async () => {
  const token = encode({ userId: user.id })

  const query = `
    {
      currentUser {
        id, email
      }
    }
  `

  const { body } = await request(app)
    .post('/graphql')
    .set('authorization', `Bearer ${token}`)
    .send({ query })
    .expect(200)

  expect(body).toMatchSnapshot()
})
