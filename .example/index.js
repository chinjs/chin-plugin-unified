import unified from '../index.js'
import { join } from 'path'
import hast2mdast from 'rehype-remark'
import mdast2hast from 'remark-rehype'

const put = join(__dirname, 'put')
const out = join(__dirname, 'out')

export default {
  put,
  out,
  clean: true,
  processors: [
    ['h2h.html', { html: unified('h2h', { settings: { fragment: true } }) }],
    ['h2m.html', { html: unified('h2m', [ hast2mdast ]) }],
    ['m2m.md', { md: unified('m2m', { parse: { footnotes: true }, compile: { commonmark: true } }) }],
    ['m2h.md', { md: unified('m2h', [ mdast2hast ]) }]
  ]
}