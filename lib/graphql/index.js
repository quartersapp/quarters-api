const { graphqlKoa } = require('apollo-server-koa')
const schema = require('./schema')

module.exports = graphqlKoa(ctx => {
  return {
    schema,
    context: ctx.state
  }
})
