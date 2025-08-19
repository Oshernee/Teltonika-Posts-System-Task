export default interface Notification {
  id?: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  createdAt?: Date
  duration?: number
}
