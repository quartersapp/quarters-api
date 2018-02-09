const { isObject } = require('lodash')
const { InvalidArgumentsError } = require('./errors')

module.exports = function validateArgs (args, validator) {
  const result = validator(args)

  if (hasErrors(result)) {
    throw new InvalidArgumentsError({ data: result })
  }
}

function hasErrors (obj) {
  return Object.keys(obj).reduce((result, key) => {
    if (result === true) return result
    const value = obj[key]
    return isObject(value) ? hasErrors(value) : true
  }, false)
}
