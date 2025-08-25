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
          v-if="page === totalPages && displayPages[pagesToShow - 1] < totalPages - 2"
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

<style scoped>
.pagination {
  margin-top: 2rem;
}

.pagination-previous,
.pagination-next {
  background-color: #34495e;
  border-color: #4a5568;
  color: #e2e8f0;
  font-weight: 600;
  transition: all 0.3s ease;
}

.pagination-previous:hover:not(:disabled),
.pagination-next:hover:not(:disabled) {
  background-color: #2d3748;
  border-color: #667eea;
  color: #e2e8f0;
}

.pagination-previous:disabled,
.pagination-next:disabled {
  background-color: #1a202c;
  border-color: #2d3748;
  color: #718096;
  cursor: not-allowed;
}

.pagination-link {
  background-color: #34495e;
  border-color: #4a5568;
  color: #e2e8f0;
  transition: all 0.3s ease;
}

.pagination-link:hover {
  background-color: #2d3748;
  border-color: #667eea;
  color: #e2e8f0;
}

.pagination-link.is-current {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.pagination-link.is-unselectable {
  background-color: transparent;
  border-color: transparent;
  color: #a0aec0;
  cursor: default;
}

.pagination-link.is-unselectable:hover {
  background-color: transparent;
  border-color: transparent;
  color: #a0aec0;
}
</style>
