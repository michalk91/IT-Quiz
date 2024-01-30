<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue'
import BodyComponent from './components/BodyComponent.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <HeaderComponent />
    </div>
  </header>
  <body>
    <BodyComponent />
  </body>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  margin: 0 auto;
  justify-content: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  nav {
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
