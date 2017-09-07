const log = require('lib/logger')

const type = 'graphql_query'

module.exports = async (ctx, next) => {
  const { body } = ctx.request

  const logInfo = { userId: ctx.state.userId, type, operationName: body.operationName }

  log.info(logInfo, `---> GraphQL ${body.operationName}`)
  log.trace({ variables: body.variables }, body.query)

  const start = Date.now()

  await next()

  const end = Date.now()
  log.info(logInfo, `<--- GraphQL ${body.operationName} ${end - start}ms`)
}
