import chalk from 'chalk'

export default function handleError(err) {
  if (err.name === 'MikuError') {
    console.log(chalk.red(`\n  > ${err.message}\n`))
  } else {
    console.log(chalk.red(err.stack))
  }
  process.exit(1)
}
