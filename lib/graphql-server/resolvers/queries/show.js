const { toInteger } = require('lodash')

module.exports = async (obj, args, ctx, info) => {
  return ctx.loaders.showById.load(toInteger(args.id))
}
