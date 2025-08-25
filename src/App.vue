<template>
  <NavBar />
  <NotificationContainer />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from './components/Navbar.vue'
import NotificationContainer from './components/Notification.vue'
import { useUserStore } from '@/store/Auth'

const userStore = useUserStore()

onMounted(() => {
  userStore.setUserFromLocalStorage()
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
