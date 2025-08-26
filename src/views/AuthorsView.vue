<template>
  <div class="authors-view">
    <div class="container">
      <div v-if="hasError" class="notification">
        <p>Failed to load authors. Please try again.</p>
      </div>
      <template v-else-if="authors.length > 0 || searchTerm">
        <SearchBar :count="authors.length" @input-changed="handleSearchInput" />
        <AuthorCardList :authors="authors" />
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
      <div v-else-if="!isLoading" class="has-text-centered p-6">
        <div class="empty-state">
          <span class="icon is-large has-text-grey-light">
            <i class="fas fa-users fa-3x"></i>
          </span>
          <h3 class="title is-4 has-text-grey">No Authors Found</h3>
          <p class="has-text-grey">There are no authors to display at the moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Author } from '@/types/Author'
import { useNotificationStore } from '@/store/Notification'
import AuthorService from '@/services/authorService'
import AuthorCardList from '@/components/Author/AuthorCardList.vue'
import Pagination from '@/components/Pagination.vue'
import SearchBar from '@/components/SearchBar.vue'

const notificationStore = useNotificationStore()
const authors = ref<Author[]>([])
const isLoading = ref(false)
const hasError = ref(false)
const totalAuthors = ref(0)
const itemsPerPage = 6
const currentPage = ref(1)
const emit = defineEmits(['page-overflow'])
const searchTerm = ref('')
let currentController: AbortController | null = null

onMounted(async () => {
  authors.value = await getAuthorsByPage()
})

watch([currentPage, searchTerm], async () => {
  authors.value = await getAuthorsByPage()
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
    if (error.name === 'CanceledError') {
      return authors.value
    }
    hasError.value = true
    notificationStore.addNotification({
      type: 'error',
      message: 'Failed to fetch authors.',
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
