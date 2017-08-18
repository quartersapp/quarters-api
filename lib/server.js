const Koa = require('koa')
const router = require('./router')
const { PORT } = require('config')

const app = new Koa()

app.use(router.routes())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
