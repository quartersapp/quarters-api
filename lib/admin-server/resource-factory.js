const Router = require('koa-router')
const { toInteger, snakeCase, omit, has } = require('lodash')
const { NotFoundError } = require('lib/errors')

const MAX_RECORDS = 100

/**
 * Creates a simple REST API for use with the admin panel.
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

  router.get('/', list)
  router.post('/', create)
  router.get('/:id', find)
  router.put('/:id', update)
  router.del('/:id', del)

  async function list (ctx) {
    // TODO sanitize filters
    const query = Model.query().where(omit(ctx.query.filter, 'q'))

    // support search queries on a single string
    if (searchField && has(ctx.query, 'filter.q')) {
      query.where(searchField, 'ilike', `%${ctx.query.filter.q}%`)
    }

    // TODO sanitize ids
    if (ctx.query.ids) {
      query.whereIn('id', ctx.query.ids)
    }

    const perPage = toInteger(ctx.query.perPage) || MAX_RECORDS

    const [records, { count }] = await Promise.all([
      query.clone()
        // TODO: sanitize pagination & sorting inputs
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
  }

  async function create (ctx) {
    // TODO validate and sanitize body
    const data = ctx.request.body
    const createdRecord = await Model.query().insert(data).returning('*')

    ctx.status = 201
    ctx.body = {
      data: createdRecord
    }
  }

  async function find (ctx) {
    // TODO: sanitize id param
    const record = await Model.query().findById(ctx.params.id)
    if (!record) throw new NotFoundError()

    ctx.body = {
      data: serialize(record)
    }
  }

  async function update (ctx) {
    // TODO: validate id param
    const record = await Model.query().findById(ctx.params.id)
    if (!record) throw new NotFoundError()

    // TODO: validate and whitelist request body
    const update = omit(ctx.request.body, ['id', 'createdAt', 'updatedAt'])
    const updatedRecord = await Model.query()
      .update(update)
      .where('id', ctx.params.id)
      .returning('*')
      .first()

    ctx.body = {
      data: serialize(updatedRecord)
    }
  }

  async function del (ctx) {
    // TODO: validate id param
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
  }

  return router
}

module.exports = resourceFactory
