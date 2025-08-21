import axios from 'axios'
import type { Post } from '@/types/Post'

export default class PostService {
  public static async getPosts(): Promise<Post[]> {
    const response = await axios.get<Post[]>('/base_url/posts')
    return response.data
  }

  public static async getPostByIdWithAuthor(id: number): Promise<Post> {
    const response = await axios.get<Post>('/base_url/' + `posts/${id}?_expand=author`)
    return response.data
  }

  public static async getPostsByPage(
    page: number,
    limit: number,
  ): Promise<[Post[], number, number]> {
    const response = await axios.get<Post[]>(
      '/base_url/posts?_expand=author&_page=' + page + '&_limit=' + limit,
    )
    if (page * (limit - 1) > parseInt(response.headers['x-total-count'])) {
      page = Math.ceil(parseInt(response.headers['x-total-count']) / limit)
      return this.getPostsByPage(page, limit)
    }
    const pageOnReturn = page
    return [response.data, response.headers['x-total-count'], pageOnReturn]
  }
}
