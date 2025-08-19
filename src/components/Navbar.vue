<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-menu">
      <div class="navbar-start">
        <RouterLink to="/" class="navbar-item">
          <span class="button is-primary">Home</span>
        </RouterLink>
        <RouterLink to="/authors" class="navbar-item">
          <span class="button is-primary">Authors</span>
        </RouterLink>
        <RouterLink to="/login" class="navbar-item">
          <span class="button is-primary">Login</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
  background-color: rgba(66, 185, 131, 0.2) !important;
  justify-content: center;
}

.navbar-menu {
  box-shadow: none;
}

.navbar-start {
  margin: 0 auto;
}

.navbar-item {
  padding: 0.5rem 1rem;
}
</style>
