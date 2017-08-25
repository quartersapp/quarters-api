const Router = require('koa-router')

const router = new Router()
router.post('/login', require('./controllers/login'))

module.exports = router
