/* eslint-env jest */

const { APIError } = require('../../errors')
const exceptionHandler = require('../exception-handler')

it('responds with a 500 error if an unexpected exception occurs', async () => {
  const ctx = {}
  const next = jest.fn(() => {
    throw new Error('Database crash')
  })

  await exceptionHandler()(ctx, next)

  expect(ctx).toEqual({
    body: {
      status: 500,
      code: 'internal_server_error',
      message: 'Unexpected error'
    },
    status: 500
  })
})

it('handles an API error', async () => {
  const ctx = {}
  const next = jest.fn(() => {
    throw new APIError(400, 'bad_request', 'Bad request')
  })

  await exceptionHandler()(ctx, next)

  expect(ctx).toEqual({
    body: {
      status: 400,
      code: 'bad_request',
      message: 'Bad request'
    },
    status: 400
  })
})
