<template>
  <router-view/>
</template>

<script>
export default {
  created() {
    
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: content-box;
}

html, body, #app {

  height: 100%;
  margin: 0;
  overflow: hidden;
  background: #e6ecf1;
  font-family: "Roboto", sans-serif;
}

#app {
  display: flex;
  align-items: center;
  justify-content: center;

}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
