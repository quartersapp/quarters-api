const fs = require('fs')
const path = require('path')

const factories = fs.readdirSync(path.resolve(__dirname, './factories'))

module.exports = function fixture (Model, params) {
  const factoryFilename = `${Model.name.toLowerCase()}-factory.js`

  return Model.create(
    factories.includes(factoryFilename)
      ? require(`./factories/${factoryFilename}`)(params)
      : params
    )
}
