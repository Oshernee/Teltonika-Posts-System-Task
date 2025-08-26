<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <button
      class="pagination-previous button"
      @click="updateCurrentPage(currentPage - 1)"
      :disabled="currentPage <= 1"
    >
      Previous
    </button>
    <button
      class="pagination-next button"
      @click="updateCurrentPage(currentPage + 1)"
      :disabled="currentPage >= totalPages"
    >
      Next page
    </button>
    <ul class="pagination-list">
      <li v-for="page in displayPages" :key="page">
        <span
          class="pagination-link is-unselectable"
          v-if="page === totalPages && displayPages[displayPages.length - 2] < totalPages - 1"
        >
          ...
        </span>
        <button
          class="pagination-link"
          @click="updateCurrentPage(page)"
          :class="{ 'is-current': page === currentPage }"
        >
          {{ page }}
        </button>
        <span class="pagination-link is-unselectable" v-if="page === 1 && displayPages[1] > 2">
          ...
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  totalItems: number
  itemsPerPage: number
  currentPage?: number
}>()

const emit = defineEmits(['page-changed', 'page-overflow'])
const currentPage = ref(1)
const pagesToShow = 5

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage)
})

watch(
  () => props.currentPage,
  (newPage) => {
    if (newPage && newPage !== currentPage.value) {
      currentPage.value = newPage
    }
  },
)

const displayPages = computed(() => {
  const startPage = Math.max(1, currentPage.value - Math.floor(pagesToShow / 2))
  const endPage = Math.min(totalPages.value, startPage + pagesToShow - 1)

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  if (endPage < totalPages.value) {
    pages.push(totalPages.value)
  }
  if (startPage > 1) {
    pages.unshift(1)
  }

  return pages
})

const updateCurrentPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
    emit('page-changed', currentPage.value)
  } else if (page > totalPages.value) {
    emit('page-overflow', page)
    currentPage.value = totalPages.value
    emit('page-changed', currentPage.value)
  }
}
</script>
