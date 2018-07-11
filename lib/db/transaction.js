const { transaction } = require('objection')
const knex = require('./connection')

module.exports = (handler) => transaction(knex, handler)
