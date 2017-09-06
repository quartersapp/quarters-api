const { PORT } = require('config')
const { log } = require('lib/logger/index')
const app = require('lib/app')

app.listen(PORT, () => {
  log.info(`Server is running on port ${PORT}`)
})
