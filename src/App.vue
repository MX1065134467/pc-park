<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: auto;
  position: relative;
  box-sizing: border-box;
}

p {
  margin: 0;
}

i {
  font-style: normal;
}

ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}

</style>
