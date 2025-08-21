<template>
  <div class="authors-view">
    <div v-if="isLoading" class="has-text-centered p-6">
      <div class="is-loading"></div>
      <p class="mt-4">Loading authors...</p>
    </div>
    <div v-else-if="hasError" class="notification">
      <p>Failed to load authors. Please try again.</p>
      <button class="button is-danger is-outlined mt-3" @click="retryFetch">Retry</button>
    </div>
    <template v-else-if="authors.length > 0">
      <AuthorCardList :authors="authors" />
    </template>
    <div v-else class="has-text-centered p-6">
      <div class="empty-state">
        <span class="icon is-large has-text-grey-light">
          <i class="fas fa-users fa-3x"></i>
        </span>
        <h3 class="title is-4 has-text-grey">No Authors Found</h3>
        <p class="has-text-grey">There are no authors to display at the moment.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Author } from '@/types/Author'
import { useNotificationStore } from '@/store/Notification'
import AuthorService from '@/services/authorService'
import AuthorCardList from '@/components/Author/AuthorCardList.vue'

const notificationStore = useNotificationStore()
const authors = ref<Author[]>([])
const isLoading = ref(false)
const hasError = ref(false)

onMounted(async () => {
  authors.value = await getAuthors()
})

const getAuthors = async () => {
  isLoading.value = true
  hasError.value = false

  try {
    const authors = await AuthorService.getAuthors()
    return authors
  } catch (error) {
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

const retryFetch = () => {
  getAuthors()
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
