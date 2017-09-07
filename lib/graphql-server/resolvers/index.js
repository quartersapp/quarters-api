module.exports = ['queries', 'types', 'scalars'].reduce((result, type) => {
  return Object.assign(result, require(`./${type}/index`))
}, {})
