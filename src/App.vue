<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import UwPrototype from './components/UwPrototype'
import Counter from './components/Counter'
import store from './vuex/store'

export default {
  store,
  components: {
    UwPrototype,
    Counter
  }
}
</script>

<style>
</style>
