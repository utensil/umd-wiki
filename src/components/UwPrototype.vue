<template lang="jade">
nav.navbar.navbar-fixed-top.navbar-dark.bg-inverse
  a.navbar-brand(href='#') {{title}}
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
            a.dropdown-item(href='#!test.md') Another Test
    form.form-inline.pull-xs-right(v-if='showSearch')
      input.form-control(type='text', placeholder='Search')
      button.btn.btn-success-outline(type='submit') Search
</template>
<style lang="sass">

</style>
<script>
export default {
  // this is where we retrieve state from the store
  vuex: {
    state: {
      title: state => state.title,
      showSearch: state => state.showSearch
    }
  }
}
</script>