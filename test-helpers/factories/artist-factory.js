const { lorem } = require('faker')
const { random } = require('lodash')
const createFactory = require('./create-factory')

const artistNames = [
  'Lost Cousins',
  'Local Natives',
  'Andy Shauf',
  'Born Ruffians'
]

module.exports = createFactory({
  name: () => artistNames[random(0, artistNames.length - 1)],
  bio: lorem.paragraph
})
