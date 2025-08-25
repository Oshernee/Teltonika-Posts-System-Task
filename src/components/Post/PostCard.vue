<template>
  <div class="card is-clickable" @click="navigateToPost">
    <div class="card-content">
      <div class="content">
        <p class="post-title">Title: {{ props.post.title }}</p>
        <p class="author-name">{{ checkAuthor() }}</p>
        <p class="post-id">
          {{
            props.post.updated_at === props.post.created_at || !props.post.updated_at
              ? `Created at: ${formatDate(props.post.created_at)}`
              : `Last updated at: ${formatDate(props.post.updated_at)}`
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Post } from '@/types/Post'
import { useRouter } from 'vue-router'

const props = defineProps<{
  post: Post
}>()

const checkAuthor = () => {
  if (props.post.author && props.post.author.name && props.post.author.surname) {
    return `Author: ${props.post.author.name} ${props.post.author.surname}`
  }
  if (!props.post.author) {
    return 'Author not found'
  }
  return "Author doesn't have a name"
}

const router = useRouter()

const navigateToPost = () => {
  router.push({
    name: 'post-detail',
    params: {
      id: props.post.id,
    },
  })
}

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'

  const dateObj = date instanceof Date ? date : new Date(date)

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
