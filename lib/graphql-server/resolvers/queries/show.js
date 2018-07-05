module.exports = async (obj, args, ctx, info) => {
  return ctx.loaders.showById.load(args.id)
}
