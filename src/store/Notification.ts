import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type Notification from '@/interfaces/Notification'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  const NOTIFICATION_COLORS = {
    success: 'success',
    error: 'danger',
    info: 'info',
    warning: 'warning',
  }

  const addNotification = (notification: Notification) => {
    const id = crypto.randomUUID()
    notifications.value.unshift({ ...notification, id, createdAt: new Date(), duration: 5000 })

    setTimeout(() => {
      removeNotificationById(id)
    }, 5000)
  }

  const removeNotificationById = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  const getNotificationColor = (type: Notification['type']) => {
    return NOTIFICATION_COLORS[type] || NOTIFICATION_COLORS.info
  }

  return {
    notifications,
    addNotification,
    removeNotificationById,
    getNotificationColor,
  }
})
