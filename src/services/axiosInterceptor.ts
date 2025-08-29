import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

class UniversalService {
  private static instance: AxiosInstance

  static {
    this.createInstance()
  }

  private static createInstance(): void {
    this.instance = axios.create({
      baseURL: '/base_url',
      timeout: 10000,
    })

    this.setupInterceptors()
  }

  private static setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        const originalMessage = error.response?.data?.message

        if (error.response?.status === 400) {
          error.response.data = {
            ...error.response.data,
            message: originalMessage || 'Bad request - please check your input.',
          }
        }
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          error.response.data = {
            ...error.response.data,
            message: originalMessage || 'Unauthorized access - please log in again.',
          }
        }
        if (error.response?.status === 403) {
          error.response.data = {
            ...error.response.data,
            message:
              originalMessage || 'Forbidden - you do not have permission to access this resource.',
          }
        }
        if (error.response?.status === 404) {
          error.response.data = {
            ...error.response.data,
            message: originalMessage || 'Resource not found - please check the URL.',
          }
        }
        if (error.response?.status === 500) {
          error.response.data = {
            ...error.response.data,
            message: originalMessage || 'Server error - please try again later.',
          }
        }

        return Promise.reject(error)
      },
    )
  }

  public static get axiosInstance(): AxiosInstance {
    return this.instance
  }
}

export default UniversalService
