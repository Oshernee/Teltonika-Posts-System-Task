import type { Author } from './Author'

export interface Post {
  id: number
  title: string
  body: string
  authorId: number
  userId: number
  created_at: string
  updated_at: string
  author?: Author
}
