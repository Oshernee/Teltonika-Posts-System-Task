import axios from 'axios'
import type { Author } from '@/types/Author'
import { API_BASE_URL } from '@/config/constants'

export default class AuthorService {
  private static readonly API_URL = `${API_BASE_URL}/authors`

  public static async getAuthors(): Promise<Author[]> {
    const response = await axios.get<Author[]>(this.API_URL)
    return response.data
  }

  public static async getAuthorById(id: number): Promise<Author> {
    const response = await axios.get<Author>(`${this.API_URL}/${id}`)
    return response.data
  }

  public static async createAuthor(author: Author): Promise<Author> {
    const response = await axios.post<Author>(this.API_URL, author)
    return response.data
  }

  public static async updateAuthor(author: Author): Promise<Author> {
    const response = await axios.put<Author>(`${this.API_URL}/${author.id}`, author)
    return response.data
  }

  public static async deleteAuthor(id: number): Promise<void> {
    await axios.delete(`${this.API_URL}/${id}`)
  }
}
