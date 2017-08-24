const Router = require('koa-router')
const oauth = require('./index')

const router = new Router()
router.post('/token', oauth.grant())

module.exports = router
