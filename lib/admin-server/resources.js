const Router = require('koa-router')
const resourceFactory = require('./resource-factory')
const models = require('lib/db/models')

const router = new Router()

const resources = [{
  prefix: '/artists',
  model: models.Artist
}, {
  prefix: '/cities',
  model: models.City,
  searchField: 'name'
}, {
  prefix: '/genres',
  model: models.Genre
}, {
  prefix: '/shows',
  model: models.Show
}, {
  prefix: '/venues',
  model: models.Venue
}, {
  prefix: '/users',
  model: models.User,
  serializer: require('./serializers/user')
}]

resources.forEach(resource => {
  const resourceRouter = resourceFactory(resource)
  router.use(resourceRouter.routes(), resourceRouter.allowedMethods())
})

module.exports = router
