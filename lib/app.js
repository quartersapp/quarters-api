const Koa = require('koa')
const koaBody = require('koa-bodyparser')

const router = require('./router')
const oauth = require('./oauth')

const app = new Koa()
app.use(koaBody())

app.use(oauth.authorise())
app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
