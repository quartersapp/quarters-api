module.exports = {
  author: async (message, args, ctx, info) => {
    return ctx.loaders.userById.load(message.userId)
  },

  sentAt: message => message.createdAt
}
