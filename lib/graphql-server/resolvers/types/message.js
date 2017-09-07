module.exports = {
  author: async (message, args, context, info) => {
    return context.loaders.userById.load(message.userId)
  },

  sentAt: message => message.createdAt
}
