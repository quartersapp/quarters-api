const { createError } = require('apollo-errors')

const InvalidArgumentsError = createError('InvalidArgumentsError', {
  message: 'Invalid arguments error'
})

module.exports = {
  InvalidArgumentsError
}
