# miku!

[![NPM version](https://img.shields.io/npm/v/miku.svg?style=flat)](https://npmjs.com/package/miku) [![NPM downloads](https://img.shields.io/npm/dm/miku.svg?style=flat)](https://npmjs.com/package/miku) [![Build Status](https://img.shields.io/circleci/project/egoist/miku/master.svg?style=flat)](https://circleci.com/gh/egoist/miku) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

A general-purpose JS/CSS/HTML prototype tool.

Like jsbin/jsfiddle/codepen but lies on your file system, with more powerful preprocessors support and your favorite editor is your playground!

## How to use

Install it:

```bash
yarn add miku --dev
# optionally you can install it globally
# but it's recommend to install locally
```

Add npm scripts:

```json
{
  "scripts": {
    "try": "miku example.js"
  }
}
```

After that, populate an `example.js` with the code you wanna try in your project:

```js
setInterval(() => {
  document.body.innerHTML = new Date()
}, 1000)
```

Finally, you can run `yarn try` to see how your code works in action.

You can also run `miku init my-demo` to create an empty project in seconds.

Run `./node_modules/.bin/miku -h` or `miku -h` if installed globally to get help.

## What languages and preprocessors it supports

- **JavaScript/ES2015+** (built-in)
- JSX (built-in)
- TypeScript
- CoffeeScript
- PostCSS with [cssbag](https://github.com/egoist/cssbag)
- Stylus
- SASS/SCSS
- Less
- [Vue](https://github.com/vuejs/vue-loader)
- [Svelte](https://github.com/sveltejs/svelte-loader)

Note: to use non-built-in features, please install its loader first, for example:

```bash
# for sass
yarn add node-sass sass-loader
# for vue
yarn add vue vue-loader
```

## How does it work

Every input file will be processed by miku using webpack, and we also use an `index.html` to load them, you can also pass in an HTML file to override this file, eg: `miku example.js example.html`

## Use cases

- you have some js code to demo: `miku example.js`
- you have some css and html code to demo: `miku example.css example.html`
- you need preprocessors: `miku example.coffee`

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**miku** © [EGOIST](https://github.com/egoist), Released under the [MIT](https://egoist.mit-license.org/) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/miku/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)
