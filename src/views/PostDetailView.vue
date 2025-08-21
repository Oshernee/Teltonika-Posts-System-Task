<template>
  <div class="container mt-6">
    <div class="columns is-centered">
      <div class="column is-8-desktop is-10-tablet">
        <div class="box">
          <h1 class="title">{{ post?.title || 'Loading...' }}</h1>

          <p class="subtitle is-6">By {{ post?.author?.name || 'Loading author...' }}</p>

          <p class="is-size-7 has-text-grey mb-4">
            {{
              post?.updated_at === post?.created_at || !post?.updated_at
                ? `Created: ${formatDate(post?.created_at)}`
                : `Updated: ${formatDate(post?.updated_at)}`
            }}
          </p>

          <div class="content">
            {{ post?.body || 'Loading content...' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { onMounted, ref } from 'vue'
import PostService from '@/services/postService'
import { useNotificationStore } from '@/store/Notification'
import { useRoute } from 'vue-router'

const notificationStore = useNotificationStore()
const post = ref<Post>()
const route = useRoute()
const id = Number(route.params.id)

onMounted(async () => {
  post.value = await getPostById(id)
})

const getPostById = async (id: number) => {
  try {
    const post = await PostService.getPostByIdWithAuthor(id)
    return post
  } catch (error) {
    notificationStore.addNotification({
      type: 'error',
      message: 'Failed to fetch post.',
    })
    return
  }
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
