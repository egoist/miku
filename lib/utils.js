import fs from 'fs'
import path from 'path'
import home from 'user-home'

export function cwd(...args) {
  return path.join(process.cwd(), ...args)
}

export function ownDir(...args) {
  return path.join(__dirname, '../../', ...args)
}

export function readGlobalConfig() {
  const file = path.join(home, '.miku', 'config.js')
  if (fs.existsSync(file)) {
    return require(file)
  }
  return null
}

export function readGlobalWebpackConfig() {
  const file = path.join(home, '.miku', 'webpack.config.js')
  if (fs.existsSync(file)) {
    return require(file)
  }
  return null
}
