const Koa = require('koa')
const koaBody = require('koa-bodyparser')
const mount = require('koa-mount')
const cors = require('kcors')
const { CORS_WHITELIST } = require('config')

const exceptionHandler = require('./middleware/exception-handler')
const requestLogger = require('./middleware/request-logger')

const authServer = require('./auth-server')
const graphqlServer = require('./graphql-server')
const adminServer = require('./admin-server')

const app = new Koa()

// patch koa for nested & array query strings
require('koa-qs')(app, 'extended')

app.use(requestLogger())
app.use(exceptionHandler())
app.use(cors({ origin: CORS_WHITELIST }))
app.use(koaBody())

/* --- health check --- */
app.use(async (ctx, next) => {
  if (ctx.request.method === 'GET' && ctx.request.path === '/') {
    ctx.body = 'Server is running'
  }

  await next()
})

/* --- auth server --- */
app.use(mount('/auth', authServer))

/* --- graphql server --- */
app.use(mount('/graphql', graphqlServer))

/* --- admin server -- */
app.use(mount('/admin', adminServer))

module.exports = app
