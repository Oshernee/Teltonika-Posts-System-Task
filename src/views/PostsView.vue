<template>
  <div class="posts-view">
    <div class="container">
      <div class="content-wrapper">
        <PostCardList :posts="posts" />
      </div>
      <div class="pagination-wrapper">
        <Pagination
          @page-changed="currentPage = $event"
          :totalItems="Number(totalPosts)"
          :itemsPerPage="itemsPerPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Post } from '@/types/Post'
import { useNotificationStore } from '@/store/Notification'
import PostService from '@/services/postService'
import PostCardList from '@/components/Post/PostCardList.vue'
import Pagination from '@/components/Pagination.vue'

const notificationStore = useNotificationStore()
const posts = ref<Post[]>([])
const totalPosts = ref(0)
const itemsPerPage = 9
const currentPage = ref(1)

onMounted(async () => {
  posts.value = await getPostsByPage()
})

watch(currentPage, async () => {
  posts.value = await getPostsByPage()
})

const getPostsByPage = async () => {
  try {
    const page = currentPage.value
    const limit = itemsPerPage
    const [fetchedPosts, totalCount] = await PostService.getPostsByPage(page, limit)
    totalPosts.value = totalCount
    return fetchedPosts
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
.posts-view {
  min-height: 75vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content-wrapper {
  flex: 1;
  min-height: 0;
}

.pagination-wrapper {
  margin-top: 2rem;
  position: static;
  width: 100%;
}

.hero {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
}
</style>
