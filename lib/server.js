import path from 'path'
import express from 'express'
import webpack from 'webpack'

export default function server(webpackConfig) {
  const app = express()

  const compiler = webpack(webpackConfig)

  const devMiddleWare = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
  })

  app.use(devMiddleWare)

  app.use(require('webpack-hot-middleware')(compiler, {
    log: () => null
  }))

  const mfs = devMiddleWare.fileSystem
  const file = path.join(webpackConfig.output.path, 'index.html')

  devMiddleWare.waitUntilValid()

  app.get('*', (req, res) => {
    devMiddleWare.waitUntilValid(() => {
      const html = mfs.readFileSync(file)
      res.end(html)
    })
  })

  return app
}
