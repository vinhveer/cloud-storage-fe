import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'
import 'highlight.js/styles/github.css'

let registered = false

export function getHighlighter() {
  if (!registered) {
    hljs.registerLanguage('javascript', javascript)
    hljs.registerLanguage('typescript', typescript)
    hljs.registerLanguage('tsx', typescript)
    hljs.registerLanguage('json', json)
    hljs.registerLanguage('xml', xml)
    hljs.registerLanguage('html', xml)
    hljs.registerLanguage('bash', bash)
    hljs.registerLanguage('shell', bash)
    registered = true
  }
  return hljs
}



