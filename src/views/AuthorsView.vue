<template>
  <div class="authors-view">
    <div class="container">
      <div class="content-wrapper">
        <div v-if="hasError" class="notification is-danger">
          <p>Failed to load authors. Please try again.</p>
        </div>
        <template v-else-if="authors.length > 0 || searchTerm">
          <button v-if="userId" class="button is-primary" @click="openAuthorModal">
            Add Author
          </button>
          <SearchBar :count="authors.length" @input-changed="handleSearchInput" />
          <AuthorCardList :authors="authors" @update="updateAuthors" />
          <div class="pagination-wrapper is-static">
            <Pagination
              @page-changed="handlePageChange"
              @page-overflow="handlePageOverflow"
              :currentPage="currentPage"
              :totalItems="Number(totalAuthors)"
              :itemsPerPage="itemsPerPage"
            />
          </div>
        </template>
        <div v-else class="has-text-centered p-6">
          <div class="empty-state">
            <span class="icon is-large has-text-grey-light">
              <i class="fas fa-users fa-3x"></i>
            </span>
            <h3 class="title is-4 has-text-light">No Authors Found</h3>
            <p class="has-text-grey-light">There are no authors to display at the moment.</p>
          </div>
        </div>
        <Modal ref="modalRef" @update="redirectToLastPage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import type { Author } from '@/types/Author'
import { useNotificationStore } from '@/store/Notification'
import AuthorService from '@/services/authorService'
import AuthorCardList from '@/components/Author/AuthorCardList.vue'
import Pagination from '@/components/Pagination.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useUserStore } from '@/store/Auth'
import Modal from '@/components/Modal.vue'
import AuthorCreateForm from '@/components/Author/AuthorCreateForm.vue'

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const authors = ref<Author[]>([])
const isLoading = ref(false)
const hasError = ref(false)
const totalAuthors = ref(0)
const itemsPerPage = 6
const currentPage = ref(1)
const emit = defineEmits(['page-overflow'])
const searchTerm = ref('')
const modalRef = ref()
const userId = computed(() => userStore.getUser()[0] as number | null)
let currentController: AbortController | null = null

onMounted(async () => {
  authors.value = await getAuthorsByPage()
})

onUnmounted(() => {
  if (currentController) {
    currentController.abort()
  }
})

watch([currentPage, searchTerm], async () => {
  updateAuthors()
})

const getAuthorsByPage = async () => {
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
    const [fetchedAuthors, totalCount, pageOnReturn] = await AuthorService.getAuthorsByPage(
      page,
      limit,
      search,
      currentController.signal,
    )
    totalAuthors.value = totalCount
    if (pageOnReturn < currentPage.value) {
      currentPage.value = pageOnReturn
    }
    return fetchedAuthors
  } catch (error: Error | any) {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      console.log('Request was aborted')
      return authors.value
    }

    hasError.value = true
    notificationStore.addNotification({
      type: 'error',
      message: error || 'Failed to fetch authors.',
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
  const maxPage = Math.ceil(totalAuthors.value / itemsPerPage)
  currentPage.value = maxPage > 0 ? maxPage : 1
}

const openAuthorModal = () => {
  const [userId, token] = userStore.getUser()
  if (userId === null || token === null) {
    notificationStore.addNotification({
      type: 'error',
      message: `You are not authorized to access this page.`,
    })
    return
  }
  modalRef.value.open(AuthorCreateForm)
}

const redirectToLastPage = () => {
  currentPage.value = Math.ceil((totalAuthors.value + 1) / itemsPerPage)
}

const updateAuthors = async () => {
  authors.value = await getAuthorsByPage()
}
</script>

<style scoped>
.authors-view {
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
