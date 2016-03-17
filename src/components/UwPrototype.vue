<template lang="jade">
#md-all
  #md-menu
    nav.navbar.navbar-fixed-top.navbar-dark.bg-inverse
      a.navbar-brand(href='#') {{config.title}}
      button.navbar-toggler.hidden-sm-up(type='button', data-toggle='collapse', data-target='#exCollapsingNavbar')
        | &#9776;
      #exCollapsingNavbar.collapse.navbar-toggleable-xs
        ul.nav.navbar-nav
          li.nav-item.active
            a.nav-link(href='#')
              | Home
              span.sr-only (current)
          li.nav-item
            .dropdown
              a.nav-link.dropdown-toggle(data-toggle='dropdown', aria-haspopup='true', aria-expanded='false', href='#') Pages
              .dropdown-menu
                h6.dropdown-header Dropdown header
                a.dropdown-item(href='#!test.md') Test
                .dropdown-divider
                a.dropdown-item(href='#!mp.md') Another Test
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
            #md-left-column.col-md-2
            #md-content.col-md-10
              article#preview.markdown-body
              article#cache.markdown-body(style="display: none")
</template>
<style lang="sass">

</style>
<script>
import {printMarkdownAst, NavigationBarParser} from '../lib/ultra_markdown'
import * as actions from '../vuex/actions'

export default {
  // this is where we retrieve state from the store
  vuex: {
    state: {
      config: state => state.config,
      currentMdPath: state => state.currentMdPath
    }
  },
  route: {
    data () {
      let route = this.$route

      console.log(route.path, route.params, route.query, this.config.baseUrl)

      actions.changeMdPath(this.$store, route.path)
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

      window.fetch(path).then(res => {
        res.text().then(t => {
          // console.log(t)

          window.mdc.init(t, false)
        })
      })
    }

    actions.loadConfigAsync(this.$store).then(config => {
      window.fetch(`${config.baseUrl}/navigation.md`).then(res => {
        res.text().then(t => {
          printMarkdownAst(t)
          let nav = new NavigationBarParser().parse(t)

          console.log(nav)
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
