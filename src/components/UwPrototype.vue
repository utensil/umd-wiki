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
              article#preview.markdown-body
              article#cache.markdown-body(style="display: none")
</template>
<style lang="sass">

</style>
<script>
import {NavigationBarParser} from '../lib/ultra_markdown'
import * as actions from '../vuex/actions'
import {StageChain} from '../lib/stage'

export default {
  // this is where we retrieve state from the store
  vuex: {
    state: {
      config: state => state.config,
      currentMdPath: state => state.currentMdPath,
      nav: state => state.nav
    }
  },
  route: {
    data () {
      let route = this.$route

      let path = route.path === '' ? 'index.md' : route.path

      console.log(path, route.params, route.query, this.config.baseUrl)

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
      console.log('fetchAndRenderMarkdown', path)

      fetch(path).then(res => {
        res.text().then(t => {
          // console.log(t)
          window.mdc.init(t, false)
          new StageChain(['pregimmick', 'gimmick', 'postgimmick']).run()
        })
      })
    }

    actions.loadConfigAsync(this.$store).then(config => {
      fetch(`${config.baseUrl}/navigation.md`).then(res => {
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
