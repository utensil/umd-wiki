import MarkdownIt from 'markdown-it'

const MD = new MarkdownIt()

export function parseMarkdown (md) {
  let tokens = MD.parse(md)

  tokens.forEach(function (token) {
    console.log(token.type, token.content, token.tag)
    if (token.children) {
      token.children.forEach(function (childToken) {
        console.log('|->', childToken.type, childToken.content, childToken.tag)
      })
    }
  })
}

export class NavigationRenderer {
  constructor () {
    this.md = new MarkdownIt()

    let md = this.md
    let self = this

    md.renderer.rules

    self
  }

  render (navigationMarkdownText) {
    return {
      meta: {
        title: this.title
      },
      html: this.md.render(navigationMarkdownText)
    }
  }
}
