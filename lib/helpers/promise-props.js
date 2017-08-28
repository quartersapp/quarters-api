// https://github.com/Siilwyn/promise-all-props/blob/master/index.js

module.exports = function (object) {
  const keys = Object.keys(object)
  const values = []
  let key

  for (key in object) {
    values.push(object[key])
  }

  return Promise.all(values).then(function (results) {
    return keys.reduce(function (fulfilledObject, key, index) {
      fulfilledObject[key] = results[index]

      return fulfilledObject
    }, {})
  })
}
