# chin-plugin-unified

[![npm](https://img.shields.io/npm/v/chin-plugin-unified.svg?style=flat-square)](https://www.npmjs.com/package/chin-plugin-unified)
[![npm](https://img.shields.io/npm/dm/chin-plugin-unified.svg?style=flat-square)](https://www.npmjs.com/package/chin-plugin-unified)
[![Build Status](https://img.shields.io/travis/kthjm/chin-plugin-unified.svg?style=flat-square)](https://travis-ci.org/kthjm/chin-plugin-unified)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/chin-plugin-unified.svg?style=flat-square)](https://codecov.io/github/kthjm/chin-plugin-unified)

[chin](https://github.com/kthjm/chin) plugin using [unified](https://github.com/unifiedjs/unified).

## Installation
```shell
yarn add -D chin chin-plugin-unified
```

## Usage

### `unified(extension, list | preset)`

Just using [`processor.use()`](https://github.com/unifiedjs/unified#processoruseplugin-options).

```js
import unified from 'chin-plugin-unified'
import md2mdast from 'remark-parse'
import mdast2hast from 'remark-rehype'
import hastformat from 'rehype-format'
import hast2html from 'rehype-stringify'

// as list
const ext = unified('.html', [
  [md2mdast, {}],
  [mdast2hast, {}],
  [hastformat, {}],
  [hast2html, {}]
])

// as preset
const ext = unified('.html', {
  settings: {},
  plugins: [
    [md2mdast, {}],
    [mdast2hast, {}],
    [hastformat, {}],
    [hast2html, {}]
  ]
})
```

### `unified(type, list | options)`

Determines [parser/compiler](https://github.com/unifiedjs/unified#description)(/extension) by `type`.

```js
import unified from 'chin-plugin-unified'
import mdast2hast from 'remark-rehype'
import hastformat from 'rehype-format'

// as list
const ext = unified('m2h', [
  [mdast2hast, {}],
  [hastformat, {}]
])

// as options
const ext = unified('m2h', {
  parse: {},
  compile: {},
  settings: {},
  plugins: [
    [mdast2hast, {}],
    [hastformat, {}]
  ]
})
```

#### `type`

|type|parser|compiler|required in `plugins`|
|:-:|:-:|:-:|:-:|
|`"h2h"`|`rehype-parser`|`rehype-stringify`||
|`"h2m"`|`rehype-parser`|`remark-stringify`|`rehype-remark`|
|`"m2m"`|`remark-parser`|`remark-stringify`||
|`"m2h"`|`remark-parser`|`rehype-stringify`|`remark-rehype`|

#### options ( extends `preset` )
- `parse` options passed to parser.
- `compile` options passed to compiler.

<!-- - `plugins` transformers as plugin | list | preset. -->

#### reference
- [`rehype-parser`](https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse)
- [`rehype-stringify`](https://github.com/rehypejs/rehype/tree/master/packages/rehype-stringify)
- [`remark-parser`](https://github.com/remarkjs/remark/tree/master/packages/remark-parse)
- [`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
- [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
- [`remark-rehype`](https://github.com/remarkjs/remark-rehype)

## License
MIT (http://opensource.org/licenses/MIT)
