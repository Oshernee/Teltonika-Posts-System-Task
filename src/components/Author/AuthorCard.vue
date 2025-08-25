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

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  background-color: #2c3e50;
  border: 1px solid #34495e;
  transition: all 0.3s ease;
  height: 100%;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
  border-color: #667eea;
}

.card-content {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.author-name {
  color: #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.author-id {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0;
  font-style: italic;
  margin-top: auto;
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
