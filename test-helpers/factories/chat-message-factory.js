const { lorem } = require('faker')
const createFactory = require('./create-factory')

module.exports = createFactory({
  body: lorem.sentences
})
