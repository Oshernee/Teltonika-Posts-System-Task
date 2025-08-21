<template>
  <div class="post-card-list">
    <div class="container">
      <div class="columns is-multiline is-centered">
        <div v-for="post in props.posts" :key="post.id" class="column is-4-desktop is-6-tablet">
          <PostCard :post="post" :author="getAuthorName(post.authorId)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from './PostCard.vue'
import type { Post } from '@/types/Post'
import AuthorService from '@/services/authorService'
import { ref, watchEffect } from 'vue'
import Pagination from '../Pagination.vue'

const props = defineProps<{
  posts: Post[]
}>()

const authorNames = ref<Record<number, string>>({})

const fetchAuthorNames = async () => {
  const ids = props.posts.map((post) => post.authorId)
  const uniqueIds = Array.from(new Set(ids))
  for (const id of uniqueIds) {
    if (!(id in authorNames.value)) {
      try {
        const author = await AuthorService.getAuthorById(id)
        authorNames.value[id] = author.name + ' ' + author.surname || 'Unknown Author'
      } catch (error) {
        console.error('Failed to fetch author:', error)
        authorNames.value[id] = 'Unknown Author'
      }
    }
  }
}

watchEffect(() => {
  fetchAuthorNames()
})

const getAuthorName = (authorId: number): string => {
  return authorNames.value[authorId] || 'Loading...'
}
</script>

<style scoped>
.post-card-list {
  padding: 3rem 1rem;
}

.container {
  max-width: 1200px;
}

.column {
  padding: 1rem;
}
</style>
