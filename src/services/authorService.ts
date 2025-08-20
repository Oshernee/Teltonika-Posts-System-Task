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

  public static async createAuthor(author: Author): Promise<Author> {
    const response = await axios.post<Author>('base_url/authors', author)
    return response.data
  }

  public static async updateAuthor(author: Author): Promise<Author> {
    const response = await axios.put<Author>(`base_url/authors/${author.id}`, author)
    return response.data
  }

  public static async deleteAuthor(id: number): Promise<void> {
    await axios.delete(`base_url/authors/${id}`)
  }
}
