import axios from 'axios'
import type { User } from '@/types/User'
import type { Token } from 'typescript'

export default class UserService {
  public static async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>('/base_url/users')
    return response.data
  }

  public static async userLogin(
    email: string,
    password: string,
  ): Promise<[User | null, string | null]> {
    try {
      const response = await axios.post<User[]>('/base_url/users/signin', {
        email,
        password,
      })
      const { accessToken, user } = response.data
      return [user, accessToken]
    } catch (error) {
      console.error('Login failed:', error)
      return [null, null]
    }
  }
}
