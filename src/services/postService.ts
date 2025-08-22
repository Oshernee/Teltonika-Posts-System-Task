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
    searchTerm?: string,
  ): Promise<[Post[], number, number]> {
    const response = await axios.get<Post[]>(
      '/base_url/posts?_expand=author&_page=' +
        page +
        '&_limit=' +
        limit +
        (searchTerm ? '&q=' + searchTerm : ''),
    )
    if ((page - 1) * limit > parseInt(response.headers['x-total-count'])) {
      page = Math.ceil(parseInt(response.headers['x-total-count']) / limit)
      return this.getPostsByPage(page, limit, searchTerm)
    }
    const pageOnReturn = page
    return [response.data, response.headers['x-total-count'], pageOnReturn]
  }
}
