class APIError extends Error {
  constructor (status, code, message, ...args) {
    super(message, ...args)
    Object.assign(this, { status, code })
  }
}

class UnauthorizedError extends APIError {
  constructor (code = 'unauthorized', message = 'Unauthorized', ...args) {
    super(401, code, message, ...args)
  }
}

module.exports = {
  APIError,
  UnauthorizedError
}
