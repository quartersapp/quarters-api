const dataLoaders = require('../dataloaders')

module.exports = {
  resolve: (resolver, obj, args = {}, currentUserId) => {
    const context = { loaders: dataLoaders() }

    if (currentUserId) {
      context.userId = currentUserId
    }

    return resolver(obj, args, context)
  }
}
