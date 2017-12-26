const Router = require('koa-router')
const { toInteger, snakeCase, omit, has } = require('lodash')
const { NotFoundError } = require('lib/errors')

const MAX_RECORDS = 100

/**
 * Creates a simple REST API for use with the rest API.
 * Currently has minimal validation and is prone to 500 errors.
 */

function resourceFactory (options = {}) {
  const {
    prefix,
    model: Model,
    serializer: serialize = record => record,
    searchField
  } = options

  const router = new Router({ prefix })

  router.get('/', async ctx => {
    const query = Model.query().where(omit(ctx.query.filter, 'q'))

    // support search queries on a single string
    if (searchField && has(ctx.query, 'filter.q')) {
      query.where(searchField, 'ilike', `%${ctx.query.filter.q}%`)
    }

    if (ctx.query.ids) {
      query.whereIn('id', ctx.query.ids)
    }

    const perPage = toInteger(ctx.query.perPage) || MAX_RECORDS

    const [records, { count }] = await Promise.all([
      query.clone()
        .orderBy(
          snakeCase(ctx.query.sort || 'id'),
          snakeCase(ctx.query.order || 'asc')
        )
        .limit(perPage)
        .offset(perPage * (toInteger(ctx.query.page || 1) - 1)),
      query.clone()
        .count()
        .first()
    ])

    ctx.body = {
      data: records.map(serialize),
      total: toInteger(count)
    }
  })

  router.post('/', async ctx => {
    const data = ctx.request.body
    const createdRecord = await Model.query().insert(data).returning('*')
    ctx.status = 201
    ctx.body = {
      data: createdRecord
    }
  })

  router.get('/:id', async ctx => {
    const record = await Model.query().findById(ctx.params.id)
    if (!record) throw new NotFoundError()

    ctx.body = {
      data: serialize(record)
    }
  })

  router.put('/:id', async ctx => {
    const record = await Model.query().findById(ctx.params.id)
    if (!record) throw new NotFoundError()

    const update = omit(ctx.request.body, ['id', 'createdAt', 'updatedAt'])
    const updatedRecord = await Model.query()
      .update(update)
      .where('id', ctx.params.id)
      .returning('*')
      .first()

    ctx.body = {
      data: serialize(updatedRecord)
    }
  })

  router.del('/:id', async ctx => {
    const deletedRecord = await Model.query()
      .delete()
      .where('id', ctx.params.id)
      .returning('*')
      .first()

    if (!deletedRecord) throw new NotFoundError()

    ctx.status = 204
    ctx.body = {
      data: serialize(deletedRecord)
    }
  })

  return router
}

module.exports = resourceFactory
