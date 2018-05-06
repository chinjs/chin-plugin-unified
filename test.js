import assert from 'assert'
import rewire from 'rewire'
import { parse, resolve, extname } from 'path'
import unified, { createUtil } from './index.js'
import md2mdast from 'remark-parse'
import mdast2hast from 'remark-rehype'
import hast2html from 'rehype-stringify'

describe('throws', () => {
  const test = (...arg) => () => assert.throws(...arg)
  it('!indicate', test(() => unified()))
  it('invalid type', test(() => unified('invalidType')))
  it('invalid list | preset | options', test(() => unified('h2h', 'invalidSecondArg')))
})

it('e2e', () => {
  const parseExBase = (path) => {
    const { root, dir, name, ext } = parse(path)
    return { root, dir, name, ext }
  }

  const { options, processor } = unified('m2h', [ mdast2hast ])

  assert.deepEqual(options, { encoding: 'utf8' })

  return processor(
    `# title\n\n- foo\n- bar`,
    { out: parseExBase(resolve('md.md')) }
  ).then(([ outpath, contents ]) => {
    assert.equal(extname(outpath), '.html')
    assert.ok(typeof contents === 'string')
  })
})

describe('createUtil', () => {

  const processor2options = ({ attachers }) => [
    attachers[0][1],
    attachers[attachers.length - 1][1]
  ]

  const rehypeParseOpts = {
    fragment: true,
    verbose: true
  }

  const remarkParseOpts = {
    gfm: false,
    commonmark: true,
    footnotes: true,
    blocks: [],
    pedantic: true
  }

  const rehypeStringifyOpts = {
    entities: {},
    voids: [],
    quote: '\'',
    quoteSmart: true,
    preferUnquoted: true,
    omitOptionalTags: true,
    collapseEmptyAttributes: true,
    closeSelfClosing: true,
    tightSeelfClosing: true,
    tightCommaSeparatedLists: true,
    tightAttributes: true,
    allowParseErrors: true,
    allowDangerousCharacters: true,
    allowDangerousHTML: true
  }

  const remarkStringifyOpts = {
    gfm: false,
    commonmark: true,
    pedantic: true,
    entities: true,
    setext: true,
    closeAtx: true,
    looseTable: true,
    spacedTable: false,
    paddedTable: false,
    stringLength: 10,
    fence: '~',
    fences: true,
    bullet: '*',
    listItemIndent: 'mixed',
    incrementListMarker: false,
    rule: `*`,
    ruleRepetition: 6,
    ruleSpaces: false,
    strong: '_',
    emphasis: '*'
  }

  describe('unified(type[, options])', () => {

    const test = (...arg) => () => {
      const { processor } = createUtil(...arg)
      const [ parserOpts, compilerOpts ] = processor2options(processor)
      const { parse, compile } = arg[1] || {}
      assert.equal(parserOpts, parse)
      assert.equal(compilerOpts, compile)
    }

    it('("h2h", { parse, compile })',test('h2h', {
      parse: rehypeParseOpts,
      compile: rehypeStringifyOpts
    }))

    it('("h2m", { parse, compile })', test('h2m', {
      parse: rehypeParseOpts,
      compile: remarkStringifyOpts
    }))

    it('("m2m", { parse, compile })', test('m2m', {
      parse: remarkParseOpts,
      compile: remarkStringifyOpts
    }))

    it('("m2h", { parse, compile })', test('m2h', {
      parse: remarkParseOpts,
      compile: rehypeStringifyOpts
    }))

  })

  describe('unified(type[, list | preset])', () => {
    const list = [
      mdast2hast
    ]

    const test = (...arg) => () => {
      const { processor } = createUtil(...arg)
      const [ parserOpts, compilerOpts ] = processor2options(processor)
      assert.equal(parserOpts, undefined)
      assert.equal(compilerOpts, undefined)
    }

    it('(type, list)', test('m2h'))
    it('(type, list)', test('m2h', list))
    it('(type, preset)', test('m2h', { plugins: list }))
  })

  describe('unified(ext, list | preset)', () => {
    const list = [
      [md2mdast, remarkParseOpts],
      mdast2hast,
      [hast2html, rehypeStringifyOpts]
    ]

    const test = (...arg) => () => {
      const { processor } = createUtil(...arg)
      const [ parserOpts, compilerOpts ] = processor2options(processor)
      assert.equal(parserOpts, remarkParseOpts)
      assert.equal(compilerOpts, rehypeStringifyOpts)
    }

    it('(ext, list)', test('.html', list))
    it('(ext, preset)', test('.html', { plugins: list }))
  })
})