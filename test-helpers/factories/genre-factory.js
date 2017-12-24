const { random } = require('lodash')
const createFactory = require('./create-factory')

const genreNames = [
  'indie',
  'psychedelic',
  'hip hop',
  'chill'
]

module.exports = createFactory({
  name: () => genreNames[random(0, genreNames.length - 1)]
})
