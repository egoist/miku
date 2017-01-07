import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import globby from 'globby'
import chalk from 'chalk'
import webpackMerge from 'webpack-merge'
import yarnGlobally from 'installed-by-yarn-globally'
import server from './server'
import MikuError from './miku-error'
import {
  cwd,
  ownDir,
  readConfig,
  readWebpackConfig,
  hasBabelrc
} from './utils'

export default async function main(input, flags) {
  input = await globby(['!**/node_modules/**', ...input])

  const localConfig = readConfig()
  const localWebpackConfig = readWebpackConfig()

  const options = Object.assign({
    input,
    port: 3001
  }, localConfig, flags)

  if (input.length === 0) {
    throw new MikuError('no detected file...')
  }

  console.log(`\n  > Detected files:`)
  input.forEach(name => {
    console.log(`  ${chalk.green(`+ ${name}`)}`)
  })
  console.log()

  const html = input.filter(name => name.endsWith('.html'))[0]

  const babelOptions = hasBabelrc() ? {} : {
    presets: [
      [require.resolve('babel-preset-es2015'), {modules: false}],
      require.resolve('babel-preset-stage-2')
    ],
    plugins: [
      require.resolve('babel-plugin-transform-runtime'),
      [
        require.resolve('babel-plugin-transform-react-jsx'),
        {pragma: options.pragma}
      ]
    ]
  }

  const webpackConfig = {
    entry: {
      client: input.filter(name => !name.endsWith('.html'))
    },
    devtool: 'eval-source-map',
    performance: {
      hints: false
    },
    output: {
      path: cwd('.miku/dist'),
      filename: '[name].js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.css', '.vue', '.jsx'],
      modules: [
        cwd(),
        cwd('node_modules'),
        ownDir('node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        ownDir('node_modules'),
        cwd('node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: [/node_modules/]
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.(sass|scss)$/,
          loaders: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.styl$/,
          loaders: ['style-loader', 'css-loader', 'stylus-loader']
        },
        {
          test: /\.less$/,
          loaders: ['style-loader', 'css-loader', 'less-loader']
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader'
        },
        {
          test: /\.coffee$/,
          loader: 'coffee-loader'
        },
        {
          test: /\.(svelte|sve)$/,
          loader: 'svelte-loader'
        },
        {
          test: /\.ls$/,
          loader: 'livescript-loader'
        },
        {
          test: /\.(pug|jade)$/,
          loader: 'pug-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            postcss: [
              require('cssbag')()
            ],
            pug: 'pug-loader',
            jade: 'pug-loader',
            js: 'babel-loader',
            sass: 'sass-loder?indentedSyntax',
            scss: 'scss-loader',
            stylus: 'stylus-loader',
            less: 'less-loader',
            ts: 'ts-loader',
            coffee: 'coffee-loader',
            live: 'livescript-loader'
          }
        },
        {
          test: /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[hash:8].[ext]'
          }
        },
        {
          test: /\.svg$/,
          loader: 'raw-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: html || ownDir('static/index.html')
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [
            require('cssbag')()
          ],
          babel: babelOptions
        }
      })
    ]
  }

  if (yarnGlobally(__dirname)) {
    webpackConfig.resolve.modules.push(ownDir('../'))
    webpackConfig.resolveLoader.modules.push(ownDir('../'))
  }

  if (options.production) {
    const ProgressPlugin = require('webpack/lib/ProgressPlugin')

    webpackConfig.plugins.push(
      new ProgressPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compressor: {
          warnings: false
        },
        output: {
          comments: false
        }
      })
    )
  } else {
    const FriendlyErrors = require('friendly-errors-webpack-plugin')
    const PostCompile = require('post-compile-webpack-plugin')

    webpackConfig.entry.client.push(
      require.resolve('webpack-hot-middleware/client') + '?reload=true'
    )
    webpackConfig.plugins.push(
      new FriendlyErrors(),
      new PostCompile(() => {
        console.log(`> Open ${chalk.yellow(`http://localhost:${options.port}`)}\n`)
      })
    )
  }

  const finalWebpackConfig = webpackMerge(webpackConfig, localWebpackConfig)

  if (options.production) {
    webpack(finalWebpackConfig, (err, stats) => {
      if (err) {
        return console.log(err.message)
      }
      if (stats.hasErrors() || stats.hasWarnings()) {
        return console.log(stats.toString('errors-only'))
      }
      console.log(stats.toString({
        chunks: false,
        children: false,
        modules: false,
        colors: true
      }))
    })
  } else {
    try {
      const app = server(finalWebpackConfig, options)
      app.listen(options.port)
    } catch (err) {
      console.log(err.message)
      process.exit(1)
    }
  }
}
