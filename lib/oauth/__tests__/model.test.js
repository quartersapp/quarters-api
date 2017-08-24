/* eslint-env jest */

const moment = require('moment')
const knex = require('lib/db/connection')
const {
  getAccessToken,
  getClient,
  getRefreshToken,
  getUser,
  saveAccessToken
} = require('../model')

let userId
let clientId
const accessTokenExpiresOn = moment().add(1, 'hour').toDate()
const refreshTokenExpiresOn = moment().subtract(1, 'hour').toDate()

beforeEach(async () => {
  await knex.raw('TRUNCATE oauth_tokens CASCADE')
  await knex.raw('TRUNCATE oauth_clients CASCADE')
  await knex.raw('TRUNCATE users CASCADE')

  ;[userId] = await knex('users')
    .insert({
      email: 'test@example.com',
      password_hash: 'abcdef'
    })
    .returning('id')

  ;[clientId] = await knex('oauth_clients')
    .insert({
      client_secret: 'test_secret',
      redirect_uri: 'test_redirect_uri'
    })
    .returning('id')

  await knex('oauth_tokens').insert({
    access_token: 'test_access_token',
    access_token_expires_on: accessTokenExpiresOn,
    client_id: clientId,
    refresh_token: 'test_refresh_token',
    refresh_token_expires_on: refreshTokenExpiresOn,
    user_id: userId
  })
})

describe('getAccessToken', () => {
  it('fetches an access token', async () => {
    expect(
      await getAccessToken('test_access_token')
    ).toEqual({
      accessToken: 'test_access_token',
      clientId: clientId,
      expires: accessTokenExpiresOn,
      userId: userId
    })
  })
})

describe('getClient', () => {
  it('returns null if the client doesnt exist', async () => {
    expect(
      await getClient(-1, null)
    ).toEqual(null)
  })

  it('returns the client', async () => {
    expect(
      await getClient(clientId, 'test_secret')
    ).toEqual({
      clientId,
      clientSecret: 'test_secret'
    })
  })
})

describe('getRefreshToken', () => {
  it('returns null if the token doesnt exist', async () => {
    expect(
      await getRefreshToken('does_not_exist')
    ).toEqual(null)
  })

  it('returns the refresh token', async () => {
    expect(
      await getRefreshToken('test_refresh_token')
    ).toEqual({
      refreshToken: 'test_refresh_token',
      refreshTokenExpiresOn: refreshTokenExpiresOn,
      client: { id: clientId },
      user: { id: userId }
    })
  })
})

describe('getUser', () => {
  it('returns null if the user does not exist', async () => {
    expect(
      await getUser('wrong@example.com', null)
    ).toEqual(null)
  })

  it('returns null if the password does not match', async () => {
    expect(
      await getUser('test@example.com', 'wrong')
    ).toEqual(null)
  })

  it('returns the user', async () => {
    expect(
      await getUser('test@example.com', 'abcdef')
    ).toMatchObject({
      id: userId,
      email: 'test@example.com',
      password_hash: 'abcdef'
    })
  })
})

describe('saveAccessToken', () => {
  it('saves the access token', async () => {
    const token = {
      accessToken: 'new_refresh_token',
      accessTokenExpiresOn: moment().add(2, 'hours').toDate(),
      refreshToken: 'new_refresh_token',
      refreshTokenExpiresOn: moment().add(4, 'hours').toDate()
    }

    const client = { id: clientId }
    const user = { id: userId }

    await saveAccessToken(token, client, user)

    expect(
      await knex
        .select('*')
        .from('oauth_tokens')
        .where({
          access_token: token.accessToken,
          access_token_expires_on: token.accessTokenExpiresOn,
          refresh_token: token.refreshToken,
          refresh_token_expires_on: token.refreshTokenExpiresOn,
          client_id: clientId,
          user_id: userId
        })
        .first()
    ).toBeTruthy()
  })
})
