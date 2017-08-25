const Koa = require('koa')
const koaBody = require('koa-bodyparser')

const router = require('./router')

const app = new Koa()
app.use(koaBody())

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
