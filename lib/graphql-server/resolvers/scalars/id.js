const { GraphQLID } = require('graphql/type')
const { Kind } = require('graphql/language')

module.exports = Object.assign({}, GraphQLID, {
  parseLiteral: ast => {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10)
    }

    return null
  }
})
