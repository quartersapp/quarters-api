/* eslint-env mocha */

const request = require('supertest')
const app = require('lib/app').listen()
const { User } = require('lib/db/models')
const { fixture, truncate, enableSnapshots } = require('test-helpers')
const { generateToken } = require('lib/services/token-service')

describe('integration-tests/graphql-server/current-user', () => {
  let user

  beforeEach(enableSnapshots)

  beforeEach(async () => {
    await truncate(User)
    user = await fixture(User, {
      id: 12345,
      email: 'test@example.com'
    })
  })

  it('can be queried for the current user', async () => {
    const token = generateToken(user)

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

    expect(body).to.matchSnapshot()
  })
})
