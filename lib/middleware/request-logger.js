const log = require('../logger')

const type = 'http_request'

module.exports = () => async (ctx, next) => {
  const start = Date.now()
  log.info({ type }, `--> HTTP ${ctx.method} ${ctx.originalUrl}`)

  await next()

  const duration = Date.now() - start
  const { status } = ctx
  log.info({ type, status, duration }, `<-- HTTP ${ctx.method} ${ctx.originalUrl} ${status} ${duration}ms`)
}
