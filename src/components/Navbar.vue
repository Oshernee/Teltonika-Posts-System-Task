<template>
  <nav>
    <RouterLink to="/" custom v-slot="{ navigate }">
      <button @click="navigate">Home</button>
    </RouterLink>
    <RouterLink to="/authors" custom v-slot="{ navigate }">
      <button @click="navigate">Authors</button>
    </RouterLink>
    <RouterLink to="/login" custom v-slot="{ navigate }">
      <button @click="navigate">Login</button>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
nav {
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(66, 185, 131, 0.2);
}
button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
