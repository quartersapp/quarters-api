const Koa = require('koa')
const koaBody = require('koa-bodyparser')
const cors = require('kcors')
const { CORS_WHITELIST } = require('config')

const { exceptionHandler } = require('./errors')
const { verifyToken } = require('./auth')
const router = require('./router')
const { requestLogger } = require('./logger/index')

const app = new Koa()

app.use(requestLogger())
app.use(exceptionHandler())
app.use(verifyToken())
app.use(cors({ origin: CORS_WHITELIST }))
app.use(koaBody())

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
