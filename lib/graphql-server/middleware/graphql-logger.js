module.exports = async (ctx, next) => {
  const { request: { body }, logger } = ctx

  logger.info({ operation_name: body.operationName }, 'GraphQL Request')
  logger.trace({ variables: body.variables }, body.query)

  const start = Date.now()

  await next()

  logger.info({ duration_ms: Date.now() - start }, 'Graphql Response')
}
