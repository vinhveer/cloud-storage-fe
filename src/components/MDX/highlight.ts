import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import sql from 'highlight.js/lib/languages/sql'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
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
    hljs.registerLanguage('python', python)
    hljs.registerLanguage('java', java)
    hljs.registerLanguage('cpp', cpp)
    hljs.registerLanguage('c', cpp)
    hljs.registerLanguage('csharp', csharp)
    hljs.registerLanguage('php', php)
    hljs.registerLanguage('ruby', ruby)
    hljs.registerLanguage('go', go)
    hljs.registerLanguage('rust', rust)
    hljs.registerLanguage('sql', sql)
    hljs.registerLanguage('css', css)
    hljs.registerLanguage('scss', scss)
    hljs.registerLanguage('sass', scss)
    hljs.registerLanguage('less', css)
    hljs.registerLanguage('yaml', yaml)
    hljs.registerLanguage('markdown', markdown)
    registered = true
  }
  return hljs
}



