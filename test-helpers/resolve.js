const dataLoaders = require('lib/db/dataloaders')

module.exports = (resolver, obj, args = {}, currentUserId) => {
  const context = { loaders: dataLoaders() }

  if (currentUserId) {
    context.userId = currentUserId
  }

  return resolver(obj, args, context)
}
