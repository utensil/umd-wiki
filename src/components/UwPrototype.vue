<template lang="pug">
#md-all
  #md-menu
    nav.navbar.navbar-fixed-top.navbar-dark.bg-inverse
      a.navbar-brand(href='#') {{config.title}}
      button.navbar-toggler.hidden-sm-up(type='button', data-toggle='collapse', data-target='#exCollapsingNavbar')
        | &#9776;
      #exCollapsingNavbar.collapse.navbar-toggleable-xs
        ul.nav.navbar-nav(v-if="nav")
          li.nav-item(v-for="menu in nav.menus")
            .dropdown
              a.nav-link.dropdown-toggle(data-toggle='dropdown', aria-haspopup='true', aria-expanded='false', href='#') {{ menu.title }}
              .dropdown-menu
                template(v-for="item in menu.items")
                  // TODO active item
                  h6.dropdown-header(v-if="item.type == 'header'", v-html="item.text")
                  a.dropdown-item(v-if="item.type == 'link'", v-html="item.text", href="{{ item.href }}", target="{{ item.external ? '_blank' : ''}}")
                  .dropdown-divider(v-if="item.type == 'hr'")
        form.form-inline.pull-xs-right(v-if='config.showSearch')
          input.form-control(type='text', placeholder='Search')
          button.btn.btn-success-outline(type='submit') Search
  #md-body-container
    #md-body-row.row
      #md-body
        #md-title-container
          #md-title-row.row
            #md-title.col-md-12
              .page-header
                h1
        #md-content-container
          #md-content-row.row
            #md-content.col-md-12
              article#preview.markdown-body {{{wikiContent}}}
              article#cache.markdown-body(style="display: none")
</template>
<style lang="sass">

</style>
<script>
import {NavigationBarParser} from '../lib/ultra_markdown'
import * as actions from '../vuex/actions'
import {StageChain} from '../lib/stage'

const log = debug('wiki')

export default {
  // this is where we retrieve state from the store
  vuex: {
    state: {
      config: state => state.config,
      currentMdPath: state => state.currentMdPath,
      nav: state => state.nav,
      wikiContent: state => state.wikiContent
    }
  },
  route: {
    data () {
      let route = this.$route

      let path = route.path === '' ? 'index.md' : route.path

      log('route', path, route.params, route.query, this.config.baseUrl)

      actions.changeMdPath(this.$store, path)
    }
  },
  computed: {
    currentMdFullPath: function () {
      return `${this.config.baseUrl}/${this.currentMdPath}`.replace('//', '/')
    }
  },
  ready () {
    const fetchAndRenderMarkdown = () => {
      let path = this.currentMdFullPath
      log('fetch content', path)

      fetch(path).then(res => {
        res.text().then(t => {
          // log('render markdown', t)
          // window.mdc.init(t, false)
          let mdc = window.mdc
          let renderer = mdc.renderer

          // let oldRenderInline = renderer.renderInline.bind(renderer)
          // renderer.renderInline = function (tokens, options, env) {
          //   if (/image/.test(tokens[0].type)) {
          //     log('renderInline', tokens, env)
          //   }
          //   return oldRenderInline(tokens, options, env)
          // }

          let oldImageRenderRule = renderer.rules.image.bind(renderer)

          // log('mdc.renderer.rules.image', oldImageRenderRule)

          renderer.rules.image = function (tokens, idx, options, env, slf) {
            log('mdc.renderer.rules.image', tokens[idx])

            var token = tokens[idx]

            let srcIndex = token.attrIndex('src')

            log('srcIndex', srcIndex)

            if (srcIndex >= 0) {
              token.attrs[srcIndex][0] = 'data-img-src'
            }

            return oldImageRenderRule(tokens, idx, options, env, slf)
          }

          // let oldRenderToken = mdc.renderer.renderToken
          // mdc.renderer.renderToken = function (e, t, n) {
          //   log('render token', e, t, n)
          //   return oldRenderToken(e, t, n)
          // }

          let rendered = mdc.render(t)
          actions.changeWikiHtml(this.$store, rendered)

          setTimeout(function () {
            new StageChain(['pregimmick', 'gimmick', 'postgimmick']).run()
          })
        })
      })
    }

    actions.loadConfigAsync(this.$store).then(config => {
      let path = `${config.baseUrl}/navigation.md`
      log('fetch nav', path)
      fetch(path).then(res => {
        res.text().then(t => {
          // printMarkdownAst(t)
          let nav = new NavigationBarParser().parse(t)

          actions.changeNavContent(this.$store, nav)
        })
      }).then(() => {
        fetchAndRenderMarkdown()
      })
    })

    this.$watch('currentMdPath', fetchAndRenderMarkdown)
  }
}

</script>

<style lang="scss">

#md-all {
  margin-top: 54px;

  .markdown-body {
    margin-left: 20px;
    margin-right: 20px;
    max-width: 95%;
  }
}

</style>
