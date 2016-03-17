import MarkdownIt from 'markdown-it'

const MD = new MarkdownIt({
  linkify: false
})

const logToken = (token, indentDepth) => {
  indentDepth = indentDepth || 0
  let indentString = ''
  let arrowString = indentDepth > 0 ? '|->' : ''
  while (indentDepth-- > 0) {
    indentString += ' '
  }

  console.log(`${indentString}${arrowString} ${token.type}\t${token.content}\t${token.tag}`, token)
}

const logChild = (token, iterateCount) => {
  logToken(token, iterateCount)

  if (token.children) {
    token.children.forEach(function (childToken) {
      logChild(childToken, iterateCount + 1)
    })
  }
}

export const printMarkdownAst = (md) => {
  let tokens = MD.parse(md)

  tokens.forEach(function (token) {
    logChild(token, 0)
  })
}

export class NavigationBarParser {
  constructor () {
    this.md = new MarkdownIt()

    let md = this.md
    let self = this

    md.renderer.rules

    self
  }

  parse (navigationMarkdownText) {
    let ast = this.md.parse(navigationMarkdownText)

    return {
      meta: {
        title: this.getTitle(ast)
      },
      html: this.md.render(navigationMarkdownText)
    }
  }

  getTitle (ast) {
    let state = {}
    let titleToken = ast.find(function (token) {
      if (this.firstH1Hit && token.type === 'inline') {
        this.firstH1Hit = false
        return true
      }

      if (token.type === 'heading_open' && token.tag === 'h1') {
        this.firstH1Hit = true
      }

      return false
    }, state)

    return titleToken.content
  }
}
