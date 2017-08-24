const Router = require('koa-router')
const { graphiqlKoa } = require('apollo-server-koa')

const oauthRouter = require('./oauth/router')
const graphql = require('./graphql')

const router = new Router()

router.get('/', ctx => {
  ctx.body = 'Server is running'
})

router.use('/oauth', oauthRouter.routes(), oauthRouter.allowedMethods())

;['get', 'post'].forEach(method => router[method]('/graphql', graphql))
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

module.exports = router
