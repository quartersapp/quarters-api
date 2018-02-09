const Koa = require('koa')
const Router = require('koa-router')
const { API_PREFIX } = require('config')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
const dataLoaders = require('./dataloaders')
const schema = require('./schema')
const graphqlLogger = require('./middleware/graphql-logger')
const authenticateToken = require('./middleware/authenticate-token')
const { formatError, isInstance } = require('apollo-errors')

const app = new Koa()
const router = new Router()

router.use(authenticateToken())

const addDataloaders = (ctx, next) => {
  ctx.loaders = dataLoaders()
  return next()
}

const graphql = graphqlKoa(ctx => ({
  schema,
  formatError: err => {
    // hacky - but this seems to be the only place to log unexpected errors
    if (!isInstance(err.originalError)) {
      ctx.logger.error(err)
    }
    return formatError(err)
  },
  context: ctx,
  debug: false
}))
router.post('/', graphqlLogger, addDataloaders, graphql)
router.get('/', graphiqlKoa({ endpointURL: `${API_PREFIX}/graphql` }))

app.use(router.routes(), router.allowedMethods())

module.exports = app
