import type { User } from '@/types/User'
import UniversalService from './axiosInterceptor'

const api = UniversalService.axiosInstance

export default class UserService {
  public static async userLogin(
    email: string,
    password: string,
  ): Promise<[User | null, string | null]> {
    try {
      const response = await api.post<{ user: User | null; accessToken: string | null }>(
        '/users/signin',
        {
          email,
          password,
        },
      )
      const { accessToken, user } = response.data
      return [user, accessToken]
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to login'
    }
  }
}
