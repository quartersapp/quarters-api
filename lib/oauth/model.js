const knex = require('lib/db/connection')

const getAccessToken = async (bearerToken) => {
  const rows = await knex
    .select(
      'access_token',
      'client_id',
      'access_token_expires_on',
      'user_id'
    )
    .from('oauth_tokens')
    .where('access_token', bearerToken)

  const token = rows[0]

  return {
    accessToken: token.access_token,
    clientId: token.client_id,
    expires: token.access_token_expires_on,
    userId: token.user_id
  }
}

const getClient = async (clientId, clientSecret) => {
  const rows = await knex
    .select(
      'id',
      'client_secret',
      'redirect_uri'
    )
    .from('oauth_clients')
    .where({
      id: clientId,
      client_secret: clientSecret
    })

  const oauthClient = rows[0]

  if (!oauthClient) {
    return null
  }

  return {
    clientId: oauthClient.id,
    clientSecret: oauthClient.client_secret
  }
}

const getRefreshToken = async (bearerToken) => {
  const rows = await knex
    .select('')
    .from('oauth_tokens')
    .where('refresh_token', bearerToken)

  const token = rows[0]

  if (token) {
    return {
      refreshToken: token.refresh_token,
      refreshTokenExpiresOn: token.refresh_token_expires_on,
      client: { id: token.client_id },
      user: { id: token.user_id }
    }
  } else {
    return null
  }
}

const getUser = async (email, passwordHash) => {
  const rows = await knex
    .select('*')
    .from('users')
    .where({
      email,
      password_hash: passwordHash
    })

  return rows[0] || null
}

const saveAccessToken = async (token, client, user) => {
  const rows = await knex
    .insert({
      access_token: token.accessToken,
      access_token_expires_on: token.accessTokenExpiresOn,
      client_id: client.id,
      refresh_token: token.refreshToken,
      refresh_token_expires_on: token.refreshTokenExpiresOn,
      user_id: user.id
    })
    .into('oauth_tokens')

  return rows[0] || null
}

module.exports = {
  getAccessToken,
  getClient,
  getRefreshToken,
  getUser,
  saveAccessToken
}
