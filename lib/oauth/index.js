const oauthserver = require('koa-oauth-server')
const model = require('./model')

module.exports = oauthserver({
  model,
  grants: ['password'],
  debug: true
})
