const { toInteger } = require('lodash')

module.exports = async (obj, args, ctx, info) => {
  return ctx.loaders.artistById.load(toInteger(args.id))
}
