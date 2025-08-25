<template>
  <div class="post-detail-view">
    <div class="container mt-6">
      <div v-if="hasError" class="notification is-danger">
        <p>Failed to load post. Please try again.</p>
        <button
          class="button is-danger is-outlined mt-3"
          @click="handleRetry"
          :class="{ 'is-loading': isLoading }"
          :disabled="isLoading"
        >
          Retry
        </button>
      </div>
      <div v-else-if="isLoading" class="has-text-centered p-6">
        <div class="is-loading"></div>
        <p class="mt-4 has-text-light">Loading post...</p>
      </div>
      <div v-else-if="!post" class="has-text-centered p-6">
        <div class="empty-state">
          <span class="icon is-large has-text-grey-light">
            <i class="fas fa-file-alt fa-3x"></i>
          </span>
          <h3 class="title is-4 has-text-light">Post Not Found</h3>
          <p class="has-text-grey-light">The post you are looking for does not exist.</p>
        </div>
      </div>
      <div v-else class="columns is-centered">
        <div class="column is-8-desktop is-10-tablet">
          <div class="box post-box">
            <h1 class="title has-text-light">{{ post?.title }}</h1>
            <p class="subtitle is-6 pt-4 has-text-grey-light">{{ checkAuthor(post.author) }}</p>
            <p class="is-size-7 has-text-grey-light mb-4">
              {{
                post?.updated_at === post?.created_at || !post?.updated_at
                  ? `Created: ${formatDate(post?.created_at)}`
                  : `Updated: ${formatDate(post?.updated_at)}`
              }}
            </p>
            <div class="content has-text-light">
              {{ post?.body }}
            </div>
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
import { useRoute, useRouter } from 'vue-router'

const notificationStore = useNotificationStore()
const post = ref<Post | null>(null)
const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const isLoading = ref(false)
const hasError = ref(false)

onMounted(async () => {
  await getPostById(id)
})

const getPostById = async (id: number) => {
  isLoading.value = true
  hasError.value = false
  post.value = null // Reset post while loading

  try {
    const fetchedPost = await PostService.getPostByIdWithAuthor(id)
    post.value = fetchedPost
  } catch (error: Error | any) {
    hasError.value = true
    post.value = null
    if (error.status === 404) {
      router.replace({ name: 'not-found' })
    }
    notificationStore.addNotification({
      type: 'error',
      message: 'Failed to load post.',
    })
  } finally {
    isLoading.value = false
  }
}

const handleRetry = async () => {
  await getPostById(id)
}

const checkAuthor = (author: Post['author']) => {
  if (author && author.name && author.surname) {
    return `By author: ${author.name} ${author.surname}`
  }
  if (!author) {
    return 'Author not found'
  }
  return "Author doesn't have a name"
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

<style scoped>
.post-detail-view {
  min-height: calc(100vh - 56px);
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 2rem 0;
}

.post-box {
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  background-color: #2c3e50;
  border: 1px solid #34495e;
}

.title.has-text-light {
  color: #e2e8f0 !important;
}

.subtitle.has-text-grey-light {
  color: #a0aec0 !important;
}

.has-text-grey-light {
  color: #a0aec0 !important;
}

.has-text-light {
  color: #e2e8f0 !important;
}

.content.has-text-light {
  color: #e2e8f0 !important;
}

.content.has-text-light p {
  color: #e2e8f0;
}

.notification.is-danger {
  background-color: #e74c3c;
  color: #fff;
  border-radius: 8px;
}

.empty-state {
  color: #e2e8f0;
}

.empty-state .icon {
  color: #a0aec0;
}

.button.is-danger.is-outlined {
  background-color: transparent;
  border-color: #fff;
  color: #fff;
}

.button.is-danger.is-outlined:hover {
  background-color: #fff;
  color: #e74c3c;
}
</style>
