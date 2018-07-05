module.exports = (obj, args, ctx, info) => {
  return ctx.loaders.artistById.load(args.id)
}
