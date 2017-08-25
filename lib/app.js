const Koa = require('koa')
const koaBody = require('koa-bodyparser')

const exceptionHandler = require('./errors/middleware/exception-handler')
const verifyToken = require('./auth/middleware/verify-token')
const router = require('./router')

const app = new Koa()

app.use(exceptionHandler())
app.use(verifyToken())
app.use(koaBody())

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
