import type { Author } from '@/types/Author'
import UniversalService from './axiosInterceptor'
import PostService from './postService'

const api = UniversalService.axiosInstance

export default class AuthorService {
  public static async getAuthorsByUserId(userId: number): Promise<Author[]> {
    try {
      const response = await api.get<Author[]>(`/authors?userId=${userId}`)
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch author'
    }
  }

  public static async getAuthorsByPage(
    page: number,
    limit: number,
    searchTerm?: string,
    signal?: AbortSignal,
  ): Promise<[Author[], number, number]> {
    try {
      const response = await api.get<Author[]>(
        '/authors?_page=' + page + '&_limit=' + limit + (searchTerm ? '&q=' + searchTerm : ''),
        { signal },
      )
      if ((page - 1) * limit >= parseInt(response.headers['x-total-count'])) {
        page = Math.ceil(parseInt(response.headers['x-total-count']) / limit)
        return this.getAuthorsByPage(page, limit, searchTerm, signal)
      }
      const pageOnReturn = page
      return [response.data, response.headers['x-total-count'], pageOnReturn]
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch authors'
    }
  }

  public static async createAuthor(
    token: string,
    userId: number,
    name: string,
    surname: string,
  ): Promise<Author> {
    try {
      const date = new Date().toISOString()
      const response = await api.post<Author>(
        '/authors',
        {
          userId,
          name,
          surname,
          created_at: date,
          updated_at: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to create author'
    }
  }

  public static async updateAuthor(
    token: string,
    id: number,
    name: string,
    surname: string,
  ): Promise<Author> {
    try {
      const date = new Date().toISOString()
      const response = await api.put<Author>(
        `/authors/${id}`,
        {
          name,
          surname,
          updated_at: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to update author'
    }
  }

  public static async deleteAuthor(token: string, id: number): Promise<void> {
    try {
      await api.delete(`/authors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      PostService.deleteAuthorPosts(id)
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to delete author'
    }
  }
}
