const { createValidator } = require('revalidate')

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
  isEmail: createValidator(
    message => value => {
      if (!EMAIL_PATTERN.test(value)) {
        return message
      }
    },
    field => `${field} must be a valid email`
  )
}
