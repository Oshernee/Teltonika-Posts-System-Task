import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/User'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  const setUser = (newUser: User, newAccessToken: string) => {
    user.value = newUser
    accessToken.value = newAccessToken
    localStorage.setItem('accessToken', newAccessToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const setUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('accessToken')
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser)
      accessToken.value = storedToken
    }
  }

  const clearUser = () => {
    user.value = null
    accessToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  const isLoggedIn = () => {
    return (
      user.value !== null &&
      accessToken.value !== null &&
      localStorage.getItem('accessToken') !== null &&
      localStorage.getItem('user') !== null
    )
  }

  const getUser = () => {
    if (
      localStorage.getItem('user') === JSON.stringify(user.value) &&
      localStorage.getItem('accessToken') === accessToken.value
    ) {
      return [user.value?.id, accessToken.value]
    }
    clearUser()
    return [null, null]
  }

  return {
    user,
    setUser,
    accessToken,
    isLoggedIn,
    clearUser,
    setUserFromLocalStorage,
    getUser,
  }
})
