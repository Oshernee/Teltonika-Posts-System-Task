import type { Author } from '@/types/Author'

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

export interface PostInput {
  title: string
  body: string
  authorId: number
}

export interface PostUpdateInput {
  title?: string
  body?: string
  authorId?: number
}
