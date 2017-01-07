import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import globby from 'globby'
import chalk from 'chalk'
import ora from 'ora'
import webpackMerge from 'webpack-merge'
import yarnGlobally from 'installed-by-yarn-globally'
import server from './server'
import MikuError from './miku-error'
import StatsPlugin from './stats-plugin'
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

  const spinner = ora('starting...')

  const options = Object.assign({
    input,
    port: 3001,
    spinner
  }, localConfig, flags)

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
    entry,
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
      }),
      new StatsPlugin({spinner})
    ]
  }

  if (yarnGlobally(__dirname)) {
    webpackConfig.resolve.modules.push(ownDir('../'))
    webpackConfig.resolveLoader.modules.push(ownDir('../'))
  }

  try {
    const app = server(webpackMerge(webpackConfig, localWebpackConfig), options)
    app.listen(options.port)
  } catch (err) {
    spinner.stop()
    console.log(err.message)
    process.exit(1)
  }
}
