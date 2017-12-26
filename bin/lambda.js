const serverless = require('serverless-http')
const app = require('lib/app')

exports.handler = serverless(app)
