<template>
  <div class="post-card-list">
    <div class="container">
      <div class="columns is-multiline is-centered">
        <div v-for="post in props.posts" :key="post.id" class="column is-4-desktop is-6-tablet">
          <PostCard :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from './PostCard.vue'
import type { Post } from '@/types/Post'

const props = defineProps<{
  posts: Post[]
}>()
</script>

<style scoped>
.post-card-list {
  padding: 2rem 1rem;
}

.container {
  max-width: 1600px;
}

.column {
  padding: 1rem;
}
</style>
