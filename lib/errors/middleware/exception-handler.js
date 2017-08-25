module.exports = () => async (ctx, next) => {
  try {
    return await next()
  } catch (err) {
    // TODO: Add handling for various errors here
    ctx.body = { message: 'Unexpected error' }
    ctx.status = 500
  }
}
