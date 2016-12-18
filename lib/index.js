import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import globby from 'globby'
import chalk from 'chalk'
import ora from 'ora'
import server from './server'
import {cwd, ownDir} from './utils'
import MikuError from './miku-error'
import StatsPlugin from './stats-plugin'

export default async function main(input, flags) {
  input = await globby(['!**/node_modules/**', ...input])

  const spinner = ora('starting...')

  const options = Object.assign({
    input,
    port: 3001,
    spinner
  }, flags)

  if (input.length === 0) {
    throw new MikuError('no detected file...')
  }

  console.log(`\n  > Detected files:`)
  input.forEach(name => {
    console.log(`  ${chalk.green(`+ ${name}`)}`)
  })
  console.log(`\n  > Open ${chalk.yellow(`http://localhost:${options.port}`)}\n`)

  const html = input.filter(name => name.endsWith('.html'))[0]

  const entry = input.filter(name => !name.endsWith('.html'))
  entry.push(require.resolve('webpack-hot-middleware/client') + '?reload=true')

  const config = {
    entry,
    output: {
      path: cwd('.miku'),
      filename: '[name].js',
      publicPath: '/'
    },
    resolve: {
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
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            postcss: [
              require('cssbag')()
            ],
            js: 'babel-loader',
            sass: 'sass-loder?indentedSyntax',
            scss: 'scss-loader',
            stylus: 'stylus-loader',
            less: 'less-loader',
            ts: 'ts-loader',
            coffee: 'coffee-loader'
          }
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
          babel: {
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
        }
      }),
      new StatsPlugin({spinner})
    ]
  }

  try {
    const app = server(config, options)
    app.listen(options.port)
  } catch (err) {
    spinner.stop()
    console.log(err.message)
    process.exit(1)
  }
}
