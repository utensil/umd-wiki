import {stage} from './lib/stage'
import Gimmick from './lib/gimmick'
const log = debug('init')

export const init = () => {
  if (window.$ == null) {
    throw new Error('jQuery or Zepto not found!')
  }
  window.$.md = {
    version: '0.0.1',
    stage (name) {
      return stage(name)
    },
    registerGimmick (gimmick) {
      if (_.isFunction(gimmick.once)) {
        try {
          gimmick.once()
        } catch (e) {
          log('ignoring once() error of ', gimmick, e)
        }
      }
    },
    linkGimmick (gimmick, name, render) {
      log('linkGimmick', gimmick, name, render)
      // render($links, opts, href)
      if (!_.isFunction(render)) {
        // log('linkGimmick', 'render is not a function')
        return
      }
      let $links = $(`#md-content a:contains('gimmick:${name}')`)
      // log($links)
      $links.each((i, link) => {
        // log('$links.each', i, link)
        let $link = $(link)
        try {
          let opts = Gimmick.parseLink($link.text())
          let href = $link.attr('href')
          render($link, opts, href)
        } catch (e) {
          log('ignoring render() error of ', gimmick, render, e)
        }
      })
      // let opts = {}
    }
  }
}
