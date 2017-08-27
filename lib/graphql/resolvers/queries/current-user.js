module.exports = (obj, args, context, info) => {
  return context.userId
    ? context.loaders.userById(context.userId)
    : null
}
