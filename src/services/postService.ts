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
}
