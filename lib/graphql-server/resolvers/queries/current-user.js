module.exports = (obj, args, ctx, info) => {
  return ctx.state.userId
    ? ctx.loaders.userById.load(ctx.state.userId)
    : null
}
