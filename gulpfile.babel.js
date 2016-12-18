import {task, input, output, watch} from 'gulp-named'
import babel from 'gulp-babel'
import chmod from 'gulp-chmod'

const paths = {
  bin: './bin/*',
  lib: './lib/**/*.js'
}

task('bin', () => {
  input(paths.bin)
    .pipe(babel())
    .pipe(chmod(0o755))
    .pipe(output('./dist/bin'))
})

task('lib', () => {
  input(paths.lib)
    .pipe(babel())
    .pipe(output('./dist/lib'))
})

task('watch', () => {
  watch(paths.bin, ['bin'])
  watch(paths.lib, ['lib'])
})

task('build', ['bin', 'lib'])

task('default', ['build', 'watch'])
