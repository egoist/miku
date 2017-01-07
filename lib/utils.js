import fs from 'fs'
import path from 'path'

export function cwd(...args) {
  return path.join(process.cwd(), ...args)
}

export function ownDir(...args) {
  return path.join(__dirname, '../../', ...args)
}

export function readConfig() {
  const file = cwd('.miku/config.js')
  if (fs.existsSync(file)) {
    return require(file)
  }
  return null
}

export function readWebpackConfig() {
  const file = cwd('.miku/webpack.config.js')
  if (fs.existsSync(file)) {
    return require(file)
  }
  return null
}

export function hasBabelrc() {
  const file = cwd('.babelrc')
  return fs.existsSync(file)
}
