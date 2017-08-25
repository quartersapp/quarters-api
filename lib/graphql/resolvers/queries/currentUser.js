const { User } = require('lib/db/models')

module.exports = (obj, args, context, info) => {
  if (!context.userId) return null
  return User.query().findById(context.userId)
}
