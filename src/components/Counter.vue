<template>
  <div class="counter">
    Clicked: {{ count }} times
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementIfOdd">Increment if odd</button>
    <button @click="incrementAsync">Increment async</button>
  </div>
</template>

<script>
import * as actions from '../vuex/actions'

export default {
  vuex: {
    state: {
      count: state => state.count
    },
    actions
  }
}
</script>

<style lang="scss">
.counter {
  margin-top: 70px;
  margin-right: auto;
  margin-left: auto;
  width: 70%;
}
</style>
