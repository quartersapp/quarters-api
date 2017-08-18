const { PORT } = require('config')
const app = require('../lib/app')

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
