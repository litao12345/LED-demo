<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <loading :isLoading="true"></loading>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import loading from '@/components/loading/loading'

export default {
  name: 'home',
  components: {
    HelloWorld,
      loading
  }
}
</script>
