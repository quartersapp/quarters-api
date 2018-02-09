const { InvalidArgumentsError } = require('./errors')

module.exports = function formatError (error) {
  const errorResponse = {
    message: error.message,
    locations: error.locations,
    path: error.path
  }

  if (error.originalError instanceof InvalidArgumentsError) {
    errorResponse.errors = error.originalError.errors
  }

  return errorResponse
}
