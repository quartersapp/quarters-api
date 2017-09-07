const Koa = require('koa')
const Router = require('koa-router')
const loginRoute = require('./login-route')

const app = new Koa()
const router = new Router()

router.post('/login', loginRoute)

app.use(router.routes(), router.allowedMethods())

module.exports = app
