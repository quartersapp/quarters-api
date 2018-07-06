/* eslint-env mocha */

const request = require('supertest')
const app = require('lib/app').listen()
const { User } = require('lib/db/models')
const { fixture, truncate } = require('test-helpers')
const { hash } = require('lib/services/password-service')

describe('integration-tests/auth', () => {
  beforeEach(async () => {
    await truncate(User)
    await fixture(User, {
      email: 'test@example.com',
      passwordHash: await hash('password')
    })
  })

  it('allows the user to log in', async () => {
    const { body } = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
      })
      .expect(200)

    expect(body).to.have.property('token')
  })
})
