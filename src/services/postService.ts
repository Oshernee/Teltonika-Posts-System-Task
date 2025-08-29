import type { Post } from '@/types/Post'
import UniversalService from './axiosInterceptor'

const api = UniversalService.axiosInstance

export default class PostService {
  public static async getPostById(id?: number): Promise<Post> {
    try {
      const response = await api.get<Post>(`/posts/${id}?_expand=author`)
      return response.data
    } catch (error: any) {
      throw error || 'Failed to fetch post'
    }
  }

  public static async getPostsByPage(
    page: number,
    limit: number,
    searchTerm?: string,
    signal?: AbortSignal,
  ): Promise<[Post[], number, number]> {
    try {
      const response = await api.get<Post[]>(
        '/posts?_expand=author&_page=' +
          page +
          '&_limit=' +
          limit +
          (searchTerm ? '&q=' + searchTerm : ''),
        { signal },
      )
      if ((page - 1) * limit > parseInt(response.headers['x-total-count'])) {
        page = Math.ceil(parseInt(response.headers['x-total-count']) / limit)
        return this.getPostsByPage(page, limit, searchTerm)
      }
      const pageOnReturn = page
      return [response.data, response.headers['x-total-count'], pageOnReturn]
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch posts'
    }
  }
}
