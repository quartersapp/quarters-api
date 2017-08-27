/* eslint-env jest */

const request = require('supertest')
const app = require('lib/app').listen()
const { User } = require('lib/db/models')
const { userFactory } = require('test-helpers/factories')
const { hash } = require('lib/auth/password-service')

beforeEach(async () => {
  await User.query().truncate()
  await User
    .query()
    .insert(userFactory({
      email: 'test@example.com',
      passwordHash: await hash('password')
    }))
})

it('allows the user to log in', async () => {
  const { body } = await request(app)
    .post('/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password'
    })
    .expect(200)

  expect(body).toHaveProperty('token')
})
