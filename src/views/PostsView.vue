<template>
  <div class="posts-view">
    <div v-if="isLoading" class="has-text-centered p-6">
      <div class="is-loading"></div>
      <p class="mt-4">Loading posts...</p>
    </div>
    <div v-else-if="hasError" class="notification">
      <p>Failed to load posts. Please try again.</p>
      <button class="button is-danger is-outlined mt-3" @click="retryFetch">Retry</button>
    </div>
    <template v-else-if="posts.length > 0">
      <PostCardList :posts="posts" />
    </template>
    <div v-else class="has-text-centered p-6">
      <div class="empty-state">
        <span class="icon is-large has-text-grey-light">
          <i class="fas fa-users fa-3x"></i>
        </span>
        <h3 class="title is-4 has-text-grey">No Posts Found</h3>
        <p class="has-text-grey">There are no posts to display at the moment.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Post } from '@/types/Post'
import { useNotificationStore } from '@/store/Notification'
import PostService from '@/services/postService'
import PostCardList from '@/components/Post/PostCardList.vue'

const notificationStore = useNotificationStore()
const posts = ref<Post[]>([])
const isLoading = ref(false)
const hasError = ref(false)

onMounted(async () => {
  posts.value = await getPosts()
})

const getPosts = async () => {
  isLoading.value = true
  hasError.value = false

  try {
    const posts = await PostService.getPostsWithAuthors()
    return posts
  } catch (error) {
    hasError.value = true
    notificationStore.addNotification({
      type: 'error',
      message: 'Failed to fetch posts.',
    })
    return []
  } finally {
    isLoading.value = false
  }
}

const retryFetch = () => {
  getPosts()
}
</script>

<style scoped>
.authors-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
}
</style>
