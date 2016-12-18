import chalk from 'chalk'

export default class StatsPlugin {
  constructor({spinner}) {
    this.spinner = spinner
    this.prevLog = ''
    this.started = false
  }

  apply(compiler) {
    compiler.plugin('compile', () => {
      if (!this.started) {
        this.spinner.start()
        this.started = true
      }
    })
    compiler.plugin('done', stats => {
      this.spinner.stop()
      if (stats.hasErrors() || stats.hasWarnings()) {
        console.log(stats.toString('errors-only'))
      } else {
        const newLog = chalk.green('  Compiled successfully!')
        if (newLog !== this.prevLog) {
          console.log(newLog)
          this.prevLog = newLog
        }
      }
    })
  }
}
