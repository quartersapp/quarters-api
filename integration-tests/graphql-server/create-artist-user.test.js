/* eslint-env mocha */

const request = require('supertest')
const app = require('lib/app').listen()
const { User, City } = require('lib/db/models')
const { truncate, enableSnapshots } = require('test-helpers')

describe('integration-tests/graphql-server/create-artist-user', () => {
  beforeEach(() => truncate([User, City]))
  beforeEach(enableSnapshots)

  it('can create a new artist/user', async () => {
    const city = await City.create({
      name: 'Toronto',
      googlePlaceId: 'place-id'
    })

    const variables = {
      input: {
        firstName: 'Thomas',
        lastName: 'Dashney',
        artistName: 'Lost Cousins',
        email: 'test@example.com',
        password: 'pass1234',
        cityId: city.id
      }
    }

    const query = `
      mutation CreateArtistUser($input: CreateArtistUserInput!) {
        createArtistUser(input: $input) {
          artist {
            name,
            city {
              name
            }
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
