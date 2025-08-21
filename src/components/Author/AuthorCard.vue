<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <p class="author-name">{{ checkAuthor() }}</p>
        <p class="author-id">
          {{
            props.author.updated_at === props.author.created_at || !props.author.updated_at
              ? `Joined at: ${formatDate(props.author.created_at)}`
              : `Last updated at: ${formatDate(props.author.updated_at)}`
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Author } from '@/types/Author'

const props = defineProps<{
  author: Author
}>()

const checkAuthor = () => {
  if (props.author && props.author.name && props.author.surname) {
    return `Author: ${props.author.name} ${props.author.surname}`
  }
  return "Author doesn't have a name"
}

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'

  const dateObj = date instanceof Date ? date : new Date(date)

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
