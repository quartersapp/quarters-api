const Router = require('koa-router')
const { graphiqlKoa } = require('apollo-server-koa')

const { API_PREFIX } = require('config')
const { router: authRouter } = require('./auth')
const graphql = require('./graphql')
const graphqlLogger = require('./graphql/middleware/graphql-logger')

const router = new Router()

router.use('/auth', authRouter.routes(), authRouter.allowedMethods())

router.get('/', ctx => {
  ctx.body = 'Server is running'
})

router.post('/graphql', graphqlLogger, graphql)
router.get('/graphiql', graphiqlKoa({
  endpointURL: `${API_PREFIX}/graphql`
}))

module.exports = router
