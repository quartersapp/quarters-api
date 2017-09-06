const { resolve } = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './bin/lambda.js',
  target: 'node',
  node: {
    __dirname: false // https://github.com/webpack/webpack/issues/1599
  },
  externals: [
    nodeExternals({
      whitelist: 'koa-bodyparser'
    })
  ],
  resolve: {
    alias: {
      lib: resolve(__dirname, 'lib')
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: resolve(__dirname),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}
