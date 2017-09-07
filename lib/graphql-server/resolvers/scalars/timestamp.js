const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

module.exports = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  parseValue: value => new Date(value),
  serialize: value => value.getTime(),
  parseLiteral: ast => {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10)
    }

    return null
  }
})
