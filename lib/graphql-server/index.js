const Koa = require('koa')
const Router = require('koa-router')
const { API_PREFIX } = require('config')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
const dataLoaders = require('./dataloaders')
const schema = require('./schema')
const graphqlLogger = require('./middleware/graphql-logger')
const authenticateToken = require('./middleware/authenticate-token')

const app = new Koa()
const router = new Router()

router.use(authenticateToken())

router.post('/graphql', graphqlLogger, graphqlKoa(ctx => {
  ctx.loaders = dataLoaders()

  return {
    schema,
    context: ctx
  }
}))

router.get('/graphiql', graphiqlKoa({
  endpointURL: `${API_PREFIX}/graphql`
}))

app.use(router.routes(), router.allowedMethods())

module.exports = app
