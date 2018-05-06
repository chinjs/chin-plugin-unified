const unified = require('unified')
const html2hast = require('rehype-parse')
const hast2html = require('rehype-stringify')
const md2mdast = require('remark-parse')
const mdast2md = require('remark-stringify')
const { format } = require('path')

const typeMap = {
  h2h: { parser: html2hast, compiler: hast2html, ext: '.html' },
  h2m: { parser: html2hast, compiler: mdast2md, ext: '.md' },
  m2m: { parser: md2mdast, compiler: mdast2md, ext: '.md' },
  m2h: { parser: md2mdast, compiler: hast2html, ext: '.html' }
}

const isExtension = (string) => string[0] === '.'

const asserts = (condition, message) => {
  if (!condition) throw new Error(message)
}

const fwa = (obj, ...assigned) => format(Object.assign({}, obj, ...assigned))

const createUtil = (indicate, opts) => {
  let ext, processor = unified()

  if (isExtension(indicate)) {
    ext = indicate
    processor = processor.use(opts)
  } else {
    asserts(typeMap[indicate], `chin-plugin-unified: ${indicate} is invalid first argument.`)
    const { parser, compiler, ext: _ext } = typeMap[indicate]
    const { parse, compile, plugins, settings } = !opts ? {} : Array.isArray(opts) ? { plugins: opts } : opts

    ext = _ext
    processor = processor
    .use({ settings })
    .use(parser, parse)
    .use(plugins)
    .use(compiler, compile)
  }

  return { processor, ext }
}

module.exports = (indicate, opts) => {

  asserts(indicate && typeof indicate === 'string')
  asserts(!opts || Array.isArray(opts) || typeof opts === 'object')

  const { processor, ext } = createUtil(indicate, opts)

  return {
    options: { encoding: 'utf8' },
    processor: (data, { out }) =>
      processor
      .process(data)
      .then(({ contents }) => [
        fwa(out, { ext }),
        contents
      ])
  }
}

module.exports.createUtil = createUtil