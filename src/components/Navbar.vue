<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-menu">
      <div class="navbar-start">
        <RouterLink to="/" class="navbar-item">
          <span class="button is-primary">Posts</span>
        </RouterLink>
        <RouterLink to="/authors" class="navbar-item">
          <span class="button is-primary">Authors</span>
        </RouterLink>
        <RouterLink v-if="!userStore.isLoggedIn()" to="/login" class="navbar-item">
          <span class="button is-primary">Login</span>
        </RouterLink>
        <RouterLink v-else-if="userStore.isLoggedIn()" to="/posts" class="navbar-item">
          <span class="button is-primary" @click="userStore.clearUser">Logout</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/store/Auth'

const userStore = useUserStore()
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
  border-bottom: 1px solid #4a5568;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-height: 56px;
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

.navbar-item:focus,
.navbar-item:hover {
  background-color: transparent !important;
}

.button.is-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  border: none !important;
  outline: none !important;
}

.button.is-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.button.is-primary:focus,
.button.is-primary:active {
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2) !important;
  outline: none !important;
  border: none !important;
}

.router-link-active .button.is-primary {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>
