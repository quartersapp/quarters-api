const Router = require('koa-router')
const { graphiqlKoa } = require('apollo-server-koa')

const { API_PREFIX } = require('config')
const { router: authRouter } = require('./auth')
const graphql = require('./graphql')

const router = new Router()

router.use('/auth', authRouter.routes(), authRouter.allowedMethods())

router.get('/', ctx => {
  ctx.body = 'Server is running'
})

;['get', 'post'].forEach(method => router[method]('/graphql', graphql))
router.get('/graphiql', graphiqlKoa({
  endpointURL: `${API_PREFIX}/graphql`
}))

module.exports = router
