<template>
  <div class="author-card-list">
    <div class="container">
      <div class="columns is-multiline is-centered">
        <div
          v-for="author in props.authors"
          :key="author.id"
          class="column is-4-desktop is-6-tablet"
        >
          <AuthorCard :author="author" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthorCard from '@/components/Author/AuthorCard.vue'
import type { Author } from '@/types/Author'

const props = defineProps<{
  authors: Author[]
}>()
</script>

<style scoped>
.author-card-list {
  padding: 3rem 1rem;
}

.container {
  max-width: 1200px;
}

.column {
  padding: 1rem;
}
</style>
