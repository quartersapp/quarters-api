const Koa = require('koa')
const koaBody = require('koa-bodyparser')

const exceptionHandler = require('./errors/middleware/exception-handler')
const router = require('./router')

const app = new Koa()

app.use(exceptionHandler())
app.use(koaBody())

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
