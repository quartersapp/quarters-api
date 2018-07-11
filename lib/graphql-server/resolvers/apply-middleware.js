module.exports = function applyMiddleware (middleware, resolver) {
  return async (...resolverArgs) => {
    for (let i = 0; i < middleware.length; i++) {
      await middleware[i](...resolverArgs)
    }

    return resolver(...resolverArgs)
  }
}
