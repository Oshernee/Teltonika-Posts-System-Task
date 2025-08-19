<template>
  <div
    class="notification-container is-fixed is-top is-right is-flex is-flex-direction-column is-align-items-flex-end mr-2 mt-2"
    style="position: fixed; top: 50px; right: 0; z-index: 1000; gap: 0"
  >
    <div
      class="notification mb-1"
      v-for="n in notifications"
      :key="n.id"
      :class="`has-background-${notificationStore.getNotificationColor(n.type)}`"
      style="width: 350px; max-width: 350px; margin-bottom: 0.5rem"
    >
      <p>{{ n.message }}</p>
      <button class="delete" @click="notificationStore.removeNotificationById(n.id!)"></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/Notification'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
</script>
