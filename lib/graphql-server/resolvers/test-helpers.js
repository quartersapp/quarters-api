const dataLoaders = require('../dataloaders')

module.exports = {
  resolve: (resolver, obj, args = {}, currentUserId) => {
    const ctx = { state: {}, loaders: dataLoaders() }

    if (currentUserId) {
      ctx.state.userId = currentUserId
    }

    return resolver(obj, args, ctx)
  }
}
