<template>
  <v-app>
    <div id="nav">
      <router-link to="/">Search</router-link> |
      <router-link to="/universe">Character Universe</router-link> |
      <router-link to="/creator_universe">Creator Universe</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/more">More</router-link>
    </div>
    <router-view />
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
