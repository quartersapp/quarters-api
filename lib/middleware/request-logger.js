const shortid = require('shortid')
const logger = require('../logger')

const type = 'http_request'

module.exports = () => async (ctx, next) => {
  ctx.logger = logger.child({ req_id: shortid.generate() })

  const start = Date.now()
  ctx.logger.info({
    method: ctx.method,
    original_url: ctx.originalUrl
  }, `HTTP Request`)

  await next()

  const { status } = ctx
  ctx.logger.info({
    type,
    status,
    duration_ms: Date.now() - start,
    method: ctx.method,
    original_url: ctx.originalUrl
  }, 'HTTP Response')
}
