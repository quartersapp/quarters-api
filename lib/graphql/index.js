const { graphqlKoa } = require('apollo-server-koa')
const schema = require('./schema')
const dataLoaders = require('lib/db/dataloaders')

module.exports = graphqlKoa(ctx => {
  return {
    schema,
    context: {
      userId: ctx.state.userId,
      loaders: dataLoaders()
    }
  }
})
