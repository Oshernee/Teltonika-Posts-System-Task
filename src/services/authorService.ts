import axios from 'axios'
import type { Author } from '@/types/Author'

export default class AuthorService {
  public static async getAuthors(): Promise<Author[]> {
    const response = await axios.get<Author[]>('/base_url/authors')
    return response.data
  }

  public static async getAuthorById(id: number): Promise<Author> {
    const response = await axios.get<Author>(`/base_url/authors/${id}`)
    return response.data
  }

  public static async getAuthorsByPage(
    page: number,
    limit: number,
    signal?: AbortSignal,
  ): Promise<[Author[], number, number]> {
    const response = await axios.get<Author[]>(
      '/base_url/authors?_page=' + page + '&_limit=' + limit,
      { signal },
    )
    if (page * (limit - 1) > parseInt(response.headers['x-total-count'])) {
      page = Math.ceil(parseInt(response.headers['x-total-count']) / limit)
      return this.getAuthorsByPage(page, limit, signal)
    }
    const pageOnReturn = page
    return [response.data, response.headers['x-total-count'], pageOnReturn]
  }
}
