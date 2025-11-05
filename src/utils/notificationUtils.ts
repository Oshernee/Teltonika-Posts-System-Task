import { useNotificationStore } from '@/store/Notification'

export interface ErrorHandlerOptions {
  showNotification?: boolean
  customMessage?: string
  logError?: boolean
}

export class ErrorHandler {
  private static notificationStore = useNotificationStore()

  static handle(error: any, context: string, options: ErrorHandlerOptions = {}): void {
    const { showNotification = true, customMessage, logError = true } = options

    if (logError) {
      console.error(`[${context}]:`, error)
    }

    if (showNotification) {
      const message = customMessage || `Error in ${context}: ${error.message || error}`
      this.notificationStore.addNotification({
        type: 'error',
        message,
      })
    }
  }

  static success(message: string): void {
    this.notificationStore.addNotification({
      type: 'success',
      message,
    })
  }

  static info(message: string): void {
    this.notificationStore.addNotification({
      type: 'info',
      message,
    })
  }

  static unauthorized(message: string = 'You are not authorized to perform this action.'): void {
    this.notificationStore.addNotification({
      type: 'error',
      message,
    })
  }
}
