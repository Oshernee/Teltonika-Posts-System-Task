import { useUserStore } from '@/store/Auth'
import { useNotificationStore } from '@/store/Notification'

export const checkIfAuthenticated = (notification: string): boolean => {
  const userStore = useUserStore()
  const notificationStore = useNotificationStore()
  const isAuthenticated = userStore.isLoggedIn()

  if (!isAuthenticated) {
    notificationStore.addNotification({
      type: 'error',
      message: notification,
    })
    return false
  }

  return true
}
