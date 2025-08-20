<template>
  <div class="authors-view">
    <AuthorCardList :authors="authors" />
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

onMounted(async () => {
  authors.value = await getAuthors()
})

const getAuthors = async () => {
  try {
    const authors = await AuthorService.getAuthors()
    notificationStore.addNotification({
      type: 'success',
      message: 'Authors fetched successfully.',
    })
    return authors
  } catch (error) {
    notificationStore.addNotification({
      type: 'error',
      message: 'Failed to fetch authors.',
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
