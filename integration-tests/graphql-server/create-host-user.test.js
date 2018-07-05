/* eslint-env mocha */

const request = require('supertest')
const app = require('lib/app').listen()
const { User } = require('lib/db/models')
const { truncateModel, enableSnapshots } = require('test-helpers')

describe('integration-tests/graphql-server/create-host-user', () => {
  beforeEach(() => truncateModel(User))
  beforeEach(enableSnapshots)

  it('can create a new host user', async () => {
    const variables = {
      input: {
        firstName: 'Lucas',
        lastName: 'McLaughlin',
        email: 'lucas.m@gmail.com',
        password: 'pass1234',
        hostBio: 'test host bio',
        hostGooglePlaceId: 'test-google-place-id'
      }
    }

    const query = `
      mutation CreateHostUser($input: CreateHostUserInput!) {
        createHostUser(input: $input) {
          user {
            name,
            email
          }
        }
      }
    `

    const { body } = await request(app)
      .post('/graphql')
      .send({ query, variables })

    expect(body).to.matchSnapshot()
  })
})
