const { APIError } = require('../errors')
const { log } = require('lib/logger/index')

module.exports = () => async (ctx, next) => {
  try {
    return await next()
  } catch (err) {
    if (err instanceof APIError) {
      ctx.status = err.status
      ctx.body = {
        status: err.status,
        code: err.code,
        message: err.message
      }
    } else {
      log.error({ err })
      ctx.status = 500
      ctx.body = {
        status: 500,
        code: 'internal_server_error',
        message: 'Unexpected error'
      }
    }
  }
}
