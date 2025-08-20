<template>
  <div class="posts-view">
    <PostCardList :posts="posts" />
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

onMounted(async () => {
  posts.value = await getPosts()
})

const getPosts = async () => {
  try {
    const posts = await PostService.getPostsWithAuthors()
    return posts
  } catch (error) {
    notificationStore.addNotification({
      type: 'error',
      message: 'Failed to fetch posts.',
    })
    return []
  }
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
