const { AUTH: { TOKEN_SECRET } } = require('config')
const { sign, verify } = require('jsonwebtoken')

module.exports = {
  encode: ({ userId }) => sign({ userId }, TOKEN_SECRET),
  decode: token => verify(token.replace('Bearer ', ''), TOKEN_SECRET)
}
