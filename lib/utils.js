import path from 'path'

export function cwd(...args) {
  return path.join(process.cwd(), ...args)
}

export function ownDir(...args) {
  return path.join(__dirname, '../../', ...args)
}
