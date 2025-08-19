<template>
  <div>
    <h1 class="title mt-4">Posts View</h1>
    <div class="buttons space-x-2 is-justify-content-center">
      <button @click="callWarning" class="button is-warning">Show Warning</button>
      <button @click="callError" class="button is-danger">Show Error</button>
      <button @click="callSuccess" class="button is-success">Show Success</button>
      <button @click="callInfo" class="button is-info">Show Info</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/store/Notification'

const notificationStore = useNotificationStore()

function callWarning() {
  notificationStore.addNotification({
    message: 'This is a warning notification!',
    type: 'warning',
  })
}
function callError() {
  notificationStore.addNotification({
    message: 'This is an error notification!',
    type: 'error',
  })
}
function callSuccess() {
  notificationStore.addNotification({
    message: 'This is a success notification!',
    type: 'success',
  })
}
function callInfo() {
  notificationStore.addNotification({
    message: 'This is an info notification!',
    type: 'info',
  })
}
</script>
