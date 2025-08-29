<template>
  <div class="card is-clickable" @click="navigateToPost">
    <div class="card-content">
      <div class="content">
        <p class="post-title">Title: {{ props.post.title }}</p>
        <p class="author-name">{{ checkAuthor(props.post.author) }}</p>
        <p class="post-id">
          {{ checkUpdatedAt(props.post) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Post } from '@/types/Post'
import { useRouter } from 'vue-router'
import { checkAuthor, checkUpdatedAt } from '@/utils/stringUtils'

const props = defineProps<{
  post: Post
}>()

const router = useRouter()

const navigateToPost = () => {
  router.push({
    name: 'post-detail',
    params: {
      id: props.post.id,
    },
  })
}
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  background-color: #2c3e50;
  border: 1px solid #34495e;
  transition: all 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
  border-color: #667eea;
}

.card-content {
  padding: 0.25rem;
}

.post-title {
  color: #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  height: 3.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-name {
  color: #a0aec0;
  font-size: 1rem;
  margin-bottom: 0.2rem;
  font-weight: 500;
}

.post-id {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0;
  font-style: italic;
}

.is-clickable {
  cursor: pointer;
}

.is-clickable:active {
  transform: translateY(-2px);
}
</style>
