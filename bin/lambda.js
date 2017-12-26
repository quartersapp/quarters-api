const serverless = require('serverless-http')
const connection = require('lib/db/connection')
const app = require('lib/app')

const invokeApp = serverless(app)

/**
 * Connection pooling cannot be established reliably,
 * so we need to destroy the connection after each invocation
 */
exports.handler = function (event, context, cb) {
  invokeApp(event, context, (err, ...args) => {
    connection.destroy()
    cb(err, ...args)
  })
}
