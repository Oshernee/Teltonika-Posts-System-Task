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
import { onMounted, onUpdated, ref } from 'vue'

const props = defineProps<{
  totalItems: number
  itemsPerPage: number
}>()

const emit = defineEmits(['page-changed'])
const currentPage = ref(1)
const totalPages = ref(1)
const pagesToShow = 5
const displayPages = ref<number[]>([])

onUpdated(() => {
  totalPages.value = Math.ceil(props.totalItems / props.itemsPerPage)
})

const updateCurrentPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
    emit('page-changed', currentPage.value)
    updateDisplayPages()
  }
}

const updateDisplayPages = () => {
  const startPage = Math.max(1, currentPage.value - Math.floor(pagesToShow / 2))
  const endPage = Math.min(totalPages.value, startPage + pagesToShow - 1)

  displayPages.value = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  if (endPage < totalPages.value) {
    displayPages.value.push(totalPages.value)
  }
  if (startPage > 1) {
    displayPages.value.unshift(1)
  }
}
</script>
