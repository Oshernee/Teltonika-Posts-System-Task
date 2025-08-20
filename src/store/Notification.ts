import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Notification from '@/types/Notification'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  let globalTimer: number | null = null

  const addNotification = (notification: Notification) => {
    if (checkForDuplicate(notification.message)) {
      return
    }

    const id = crypto.randomUUID()
    notifications.value.unshift({ ...notification, id })

    if (!globalTimer) {
      startGlobalTimer()
    }
  }

  const startGlobalTimer = () => {
    globalTimer = setInterval(() => {
      if (notifications.value.length > 0) {
        notifications.value.pop()
      }

      if (notifications.value.length === 0) {
        stopGlobalTimer()
      }
    }, 2500)
  }

  const stopGlobalTimer = () => {
    if (globalTimer) {
      clearInterval(globalTimer)
      globalTimer = null
    }
  }

  const removeNotificationById = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
    if (notifications.value.length === 0) {
      stopGlobalTimer()
    }
  }

  const checkForDuplicate = (message: string) => {
    return notifications.value.some((n) => n.message === message)
  }

  return {
    notifications,
    addNotification,
    removeNotificationById,
  }
})
