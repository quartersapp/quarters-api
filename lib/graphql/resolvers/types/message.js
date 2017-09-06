module.exports = {
  author (message, args, context, info) {
    return context.loaders.userById(message.userId)
  },

  sentAt (message) {
    return message.createdAt
  }
}
