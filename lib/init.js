import fs from 'fs'
import copy from 'graceful-copy'
import chalk from 'chalk'
import {ownDir, cwd} from './utils'
import MikuError from './miku-error'

export default async function init(folder, options) {
  if (!folder) {
    throw new MikuError('Please specific a folder')
  }

  if (!options.force && fs.existsSync(folder)) {
    throw new MikuError(`${folder} already exists, use --force to overwrite`)
  }
  await copy(ownDir('static/template'), cwd(folder), {
    data: {
      name: folder
    }
  })
  console.log(chalk.green('\n  Successfully generated a new project!\n'))
  console.log(`  cd ${folder} && yarn && yarn try\n`)
}
