const { isObject } = require('lodash')
const { InvalidArgumentsError } = require('lib/graphql-server/errors')

module.exports = validator => resolver => (...resolverArgs) => {
  const [, args] = resolverArgs
  const result = validator(args)

  if (hasErrors(result)) {
    throw new InvalidArgumentsError({ data: result })
  }

  return resolver(...resolverArgs)
}

function hasErrors (obj) {
  return Object.keys(obj).reduce((result, key) => {
    if (result === true) return result
    const value = obj[key]
    return isObject(value) ? hasErrors(value) : true
  }, false)
}
