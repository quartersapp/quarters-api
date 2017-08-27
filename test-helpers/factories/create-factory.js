const _ = require('lodash')

/**
 * createFactory
 *
 * @param {Object} attributeGenerators Mapping of attribute names to value
 *    generator function
 * @return {Function(Object)} Factory function which takes an object of
 *    attributes as a parameter. For any attributes in the generator object
 *    which were not in the provided attributes, it will generate values for those
 *    attributes. It will return a new object, which is a merging of the provided
 *    attributes and generated values.
 */

module.exports = (attributeGenerators = {}) => {
  return (attributes = {}) => {
    const defaultValues = _(attributeGenerators)
      .omit(Object.keys(attributes))
      .mapValues(generator => generator())
      .value()

    return Object.assign({}, attributes, defaultValues)
  }
}
