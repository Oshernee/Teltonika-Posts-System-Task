<template>
  <div class="posts-view">
    <div class="container">
      <div class="content-wrapper">
        <div v-if="isLoading && posts.length === 0" class="has-text-centered p-6">
          <div class="is-loading"></div>
          <p class="mt-4">Loading posts...</p>
        </div>
        <div v-if="hasError" class="notification">
          <p>Failed to load posts. Please try again.</p>
        </div>
        <template v-else-if="posts.length > 0 || isLoading">
          <PostCardList :posts="posts" />
          <div class="pagination-wrapper is-static">
            <Pagination
              @page-changed="handlePageChange"
              @page-overflow="handlePageOverflow"
              :currentPage="currentPage"
              :totalItems="Number(totalPosts)"
              :itemsPerPage="itemsPerPage"
            />
          </div>
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
const isLoading = ref(false)
const hasError = ref(false)
const emit = defineEmits(['page-overflow'])
let currentController: AbortController | null = null

onMounted(async () => {
  posts.value = await getPostsByPage()
})

watch(currentPage, async () => {
  posts.value = await getPostsByPage()
})

const getPostsByPage = async () => {
  isLoading.value = true
  hasError.value = false
  if (currentController) {
    currentController.abort()
  }

  currentController = new AbortController()

  try {
    const page = currentPage.value
    const limit = itemsPerPage
    const [fetchedPosts, totalCount, pageOnReturn] = await PostService.getPostsByPage(
      page,
      limit,
      currentController.signal,
    )
    totalPosts.value = totalCount
    if (pageOnReturn < currentPage.value) {
      currentPage.value = pageOnReturn
    }
    return fetchedPosts
  } catch (error: Error | any) {
    if (error.name === 'CanceledError') {
      return posts.value
    }
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

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handlePageOverflow = () => {
  const maxPage = Math.ceil(totalPosts.value / itemsPerPage)
  currentPage.value = maxPage > 0 ? maxPage : 1
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
