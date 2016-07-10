import MarkdownIt from 'markdown-it'

const MD_OPTIONS = {
  linkify: false,
  html: true
}

const MD = new MarkdownIt(MD_OPTIONS)
const log = debug('ultra_markdown')

const logToken = (token, indentDepth) => {
  indentDepth = indentDepth || 0
  let indentString = ''
  let arrowString = indentDepth > 0 ? '|->' : ''
  while (indentDepth-- > 0) {
    indentString += ' '
  }

  log('', `${indentString}${arrowString} ${token.type}\t${token.content}\t${token.tag}`, token)
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

/*

  A piece of Markdown text like

  ```
  # Utrla Markdown Wiki

  [Pages]()

    * # Header
    * [<i class="fa fa-smile-o"></i> Test](test.md)
    - - - -
    * # Another header
    * [Another Test](mp.md)
    * [External Link](https://github.com/markdown-it/linkify-it)
  ```

  is already parsed by markdown-it to a AST like:

  ```
  heading_open    h1
  inline Utrla Markdown Wiki
  |-> text Utrla Markdown Wiki
  heading_close    h1
  paragraph_open   p
  inline [Pages]()
  |-> link_open    a
  |-> text Pages
  |-> link_close   a
  paragraph_close    p
  bullet_list_open   ul
  list_item_open   li
  heading_open   h1
  inline Header
  |-> text Header
  heading_close    h1
  list_item_close    li
  list_item_open   li
  paragraph_open   p
  inline [<i class="fa fa-smile-o"></i> Test](test.md)
  |-> link_open    a
  |-> text <i class="fa fa-smile-o"></i> Test
  |-> link_close   a
  paragraph_close    p
  list_item_close    li
  bullet_list_close    ul
  hr   hr
  bullet_list_open   ul
  list_item_open   li
  heading_open   h1
  inline Another header
  |-> text Another header
  heading_close    h1
  list_item_close    li
  list_item_open   li
  paragraph_open   p
  inline [Another Test](mp.md)
  |-> link_open    a
  |-> text Another Test
  |-> link_close   a
  paragraph_close    p
  list_item_close    li
  list_item_open   li
  paragraph_open   p
  inline [External Link](https://github.com/markdown-it/linkify-it)
  |-> link_open    a
  |-> text External Link
  |-> link_close   a
  paragraph_close    p
  list_item_close    li
  bullet_list_close    ul
  ```

  NavigationBarParser needs to extract structure information for navigation bar from it.
*/
export class NavigationBarParser {
  constructor () {
    this.md = new MarkdownIt(MD_OPTIONS)

    // let md = this.md
    // let self = this
    //
    // md.renderer.rules
    // self
  }

  parse (navigationMarkdownText) {
    let ast = this.md.parse(navigationMarkdownText)

    return {
      title: this.getTitle(ast),
      menus: this.getNavMenus(ast),
      html: this.md.render(navigationMarkdownText)
    }
  }

  getTitle (ast) {
    let state = {}

    // the first h1 element is considered to be the title
    let titleToken = ast.find(token => {
      if (state.hasHitFirstH1 && token.type === 'inline') {
        state.hasHitFirstH1 = false
        return true
      }

      if (token.type === 'heading_open' && token.tag === 'h1') {
        state.hasHitFirstH1 = true
      }

      return false
    })

    return titleToken.content
  }

  getNavMenus (ast) {
    let state = {
      // the count of menus including current
      // can also be used as next menu index
      menuCount: 0,
      currentMenu: null,
      isInParagraph: false,
      isInBulletList: false,
      isInItem: false,
      isInHeader: false,
      menus: []
    }

    let menus = state.menus
    ast.forEach(token => {
      NavigationBarParser.updateStateByToken(state, token)

      NavigationBarParser.createMenuIfPresent(state, token)

      let currentMenu = state.currentMenu
      if (currentMenu && _.isArray(currentMenu.items)) {
        if (token.type === 'hr') {
          currentMenu.items.push({
            type: 'hr'
          })
        } else {
          this.createMenuItemIfPresent(state, token)
        }
      }
    })

    return menus
  }

  static updateStateByToken (state, token) {
    if (token.type === 'paragraph_open') {
      state.isInParagraph = true
    }

    if (token.type === 'paragraph_close') {
      state.isInParagraph = false
    }

    if (token.type === 'bullet_list_open') {
      state.isInBulletList = true
    }

    if (token.type === 'bullet_list_close') {
      state.isInBulletList = false
    }

    if (token.type === 'list_item_open') {
      state.isInItem = true
    }

    if (token.type === 'list_item_close') {
      state.isInItem = false
    }

    if (token.type === 'heading_open') {
      state.isInHeader = true
    }

    if (token.type === 'heading_close') {
      state.isInHeader = false
    }
  }

  static isValidMenu (state, token) {
    const hasGimmick = (tokens) => {
      let gimmickContent = _.find(tokens, (t) => {
        return /^gimmick/.test(t.content)
      })

      return gimmickContent != null
    }

    return !state.isInBulletList && state.isInParagraph
      && token.type === 'inline'
      && _.isArray(token.children) && token.children.length === 3
      && token.children[0].type === 'link_open'
      && token.children[1].type === 'text'
      && token.children[2].type === 'link_close'
      // TODO ignore gimmick for now
      && !hasGimmick(token.children)
  }

  static isValidMenuItem (token) {
    return _.isArray(token.children)
      // a links consists of 3 children: open, content and close
      && token.children.length >= 3
      && token.children[0].type === 'link_open'
  }

  static createMenuIfPresent (state, token) {
    if (NavigationBarParser.isValidMenu(state, token)) {
      state.currentMenu = state.menus[state.menuCount] = {
        // token.children[1] is safe when the menu is valid
        title: token.children[1].content || '',
        items: []
      }
      state.menuCount += 1
    }
  }

  createMenuItemIfPresent (state, token) {
    let currentMenu = state.currentMenu
    if (state.isInBulletList && state.isInItem && token.type === 'inline') {
      if (state.isInHeader) {
        currentMenu.items.push({
          type: 'header',
          text: this.renderMenuItemContent(token)
        })
      } else if (NavigationBarParser.isValidMenuItem(token)) {
        let item = this.createMenuItemFromLink(token)
        if (item) {
          currentMenu.items.push(item)
        }
      } else {
        // ignore
      }
    }
  }

  createMenuItemFromLink (token) {
    let item = {
      type: 'link',
      text: this.renderMenuItemContent(token),
      // every attr is an array of 2 elements: key and value
      href: token.children[0].attrs.find(v => {
        return _.isArray(v) && v.length === 2 && v[0] === 'href'
      })[1]
    }

    // log('createMenuItemFromLink', token, item)

    // TODO move into a plugin/filter
    let isExternalLink = /^http[s]?:\/\//.test(item.href)

    if (isExternalLink) {
      item.external = true
    }

    if (/\.md$/.test(item.href) && !isExternalLink) {
      item.href = `#!${item.href}`
    }

    // TODO ignore gimmick for now
    if (/^gimmick/.test(item.href)) {
      return null
    }

    return item
  }

  renderMenuItemContent (token) {
    if (_.isArray(token.children)) {
      let markup = token.children.map(t => {
        if (!/^link_/.test(t.type)) {
          // log('renderMenuItemContent', `${t.content}-------${t.markup}`)
          // FIXME it seems wrong to just join them together,
          // possibly they never appear at the same time?
          return `${t.content}${t.markup}`
        } else {
          return ''
        }
      }).join('')

      return this.md.renderInline(markup)
    } else {
      // ignore those don't look like a menu item
      log('renderMenuItemContent', 'ignoring', token)
      return ''
      // return this.md.renderInline(token.text)
    }
  }
}
