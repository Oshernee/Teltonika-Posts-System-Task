<template>
  <div class="posts-view">
    <div class="container">
      <div class="content-wrapper">
        <div v-if="hasError" class="notification is-danger">
          <p>Failed to load posts. Please try again.</p>
        </div>
        <template v-else-if="posts.length > 0 || searchTerm">
          <button v-if="userId" class="button is-primary" @click="openPostModal">Add Post</button>
          <SearchBar :count="posts.length" @input-changed="handleSearchInput" />
          <PostCardList :posts="posts" @update="updatePosts" />
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
              <i class="fas fa-file-alt fa-3x"></i>
            </span>
            <h3 class="title is-4 has-text-light">No Posts Found</h3>
            <p class="has-text-grey-light">There are no posts to display at the moment.</p>
          </div>
        </div>
        <Modal ref="modalRef" @update="redirectToLastPage" @updateCurrent="handlePostCreated" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import type { Post } from '@/types/Post'
import { useNotificationStore } from '@/store/Notification'
import PostService from '@/services/postService'
import PostCardList from '@/components/Post/PostCardList.vue'
import Pagination from '@/components/Pagination.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useUserStore } from '@/store/Auth'
import Modal from '@/components/Modal.vue'
import PostCreateForm from '@/components/Post/PostCreateForm.vue'

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const posts = ref<Post[]>([])
const totalPosts = ref(0)
const itemsPerPage = 9
const currentPage = ref(1)
const isLoading = ref(false)
const hasError = ref(false)
const emit = defineEmits(['page-overflow'])
const searchTerm = ref('')
const userId = computed(() => userStore.getUser()[0] as number | null)
const modalRef = ref()
let currentController: AbortController | null = null

onMounted(async () => {
  posts.value = await getPostsByPage()
})

watch([currentPage, searchTerm], async () => {
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
    const search = searchTerm.value.trim()
    const [fetchedPosts, totalCount, pageOnReturn] = await PostService.getPostsByPage(
      page,
      limit,
      search,
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
      message: error || 'Failed to fetch posts.',
    })
    return []
  } finally {
    isLoading.value = false
  }
}

const handleSearchInput = (input: string) => {
  searchTerm.value = input
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handlePageOverflow = () => {
  const maxPage = Math.ceil(totalPosts.value / itemsPerPage)
  currentPage.value = maxPage > 0 ? maxPage : 1
}

const openPostModal = () => {
  const [userId, token] = userStore.getUser()
  if (userId === null || token === null) {
    notificationStore.addNotification({
      type: 'error',
      message: `You are not authorized to access this page.`,
    })
    return
  }
  modalRef.value.open(PostCreateForm)
}

const redirectToLastPage = () => {
  currentPage.value = Math.ceil((totalPosts.value + 1) / itemsPerPage)
}

const updatePosts = async () => {
  posts.value = await getPostsByPage()
}

const handlePostCreated = async () => {
  totalPosts.value = totalPosts.value + 1
  posts.value = await getPostsByPage()
}
</script>

<style scoped>
.posts-view {
  min-height: calc(100vh - 56px);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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

.title.has-text-light {
  color: #e2e8f0 !important;
}

.has-text-grey-light {
  color: #a0aec0 !important;
}

.notification.is-danger {
  background-color: #e74c3c;
  color: #fff;
}

.empty-state {
  color: #e2e8f0;
}

.empty-state .icon {
  color: #a0aec0;
}

.button.is-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  border: none !important;
  outline: none !important;
  width: 300px;
}

.button.is-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.button.is-primary:focus,
.button.is-primary:active {
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2) !important;
  outline: none !important;
  border: none !important;
}
</style>
