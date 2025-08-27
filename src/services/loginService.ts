import axios from 'axios'
import type { User } from '@/types/User'

export default class UserService {
  public static async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>('/base_url/users')
    return response.data
  }

  public static async userLogin(
    email: string,
    password: string,
  ): Promise<[User | null, string | null]> {
    const response = await axios.post<{ user: User | null; accessToken: string | null }>(
      '/base_url/users/signin',
      {
        email,
        password,
      },
    )
    const { accessToken, user } = response.data
    return [user, accessToken]
  }
}
