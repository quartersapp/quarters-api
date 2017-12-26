const Koa = require('koa')
const authorizeAdmin = require('./middleware/authorize-admin')
const resources = require('./resources')

const app = new Koa()

app.use(authorizeAdmin())
app.use(resources.routes(), resources.allowedMethods())

module.exports = app
