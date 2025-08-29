import type { Post } from '@/types/Post'
import type { Author } from '@/types/Author'
import { formatDate } from '@/utils/dateUtils'

export const checkAuthor = (author: Post['author'] | Author) => {
  if (author && author.name && author.surname) {
    return `Author: ${author.name} ${author.surname}`
  }
  if (!author) {
    return 'Author not found'
  }
  return "Author doesn't have a name"
}

export const checkUpdatedAt = (post: Post | Author) => {
  if (post.updated_at === post.created_at || !post.updated_at) {
    return `Created at: ${formatDate(post.created_at)}`
  }
  return `Last updated at: ${formatDate(post.updated_at)}`
}
