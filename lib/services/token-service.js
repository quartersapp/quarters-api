const { AUTH: { TOKEN_SECRET } } = require('config')
const { sign, verify } = require('jsonwebtoken')

module.exports = {
  generateToken: (user) => {
    return sign({ userId: user.id }, TOKEN_SECRET)
  },
  decodeToken: token => {
    return verify(token, TOKEN_SECRET)
  }
}
