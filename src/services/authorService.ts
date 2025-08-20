import axios from 'axios'
import type { Author } from '@/types/Author'

export default class AuthorService {
  public static async getAuthors(): Promise<Author[]> {
    const response = await axios.get<Author[]>('base_url/authors')
    return response.data
  }

  public static async getAuthorById(id: number): Promise<Author> {
    const response = await axios.get<Author>(`base_url/authors/${id}`)
    return response.data
  }
}
