# miku!

[![NPM version](https://img.shields.io/npm/v/miku.svg?style=flat)](https://npmjs.com/package/miku) [![NPM downloads](https://img.shields.io/npm/dm/miku.svg?style=flat)](https://npmjs.com/package/miku) [![Build Status](https://img.shields.io/circleci/project/egoist/miku/master.svg?style=flat)](https://circleci.com/gh/egoist/miku) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

A general-purpose JS/CSS/HTML prototype tool.

Like jsbin/jsfiddle/codepen but lies on your file system, with more powerful preprocessors support.

## How to use

Install it:

```bash
$ yarn add miku --dev
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

## What languages and preprocessors it supports

- JavaScript(plus ES2015+)
- TypeScript
- CoffeeScript
- PostCSS
- Stylus
- SASS/SCSS
- Less

## How does it work

Every input file will be processed by miku using webpack, and we also use an `index.html` to load them, you can also pass in an HTML file to override this file, eg: `miku example.js example.html`

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
