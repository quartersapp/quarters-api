const Koa = require('koa')
const koaBody = require('koa-bodyparser')

const { exceptionHandler } = require('./errors')
const { verifyToken } = require('./auth')
const router = require('./router')

const app = new Koa()

app.use(exceptionHandler())
app.use(verifyToken())
app.use(koaBody())

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
