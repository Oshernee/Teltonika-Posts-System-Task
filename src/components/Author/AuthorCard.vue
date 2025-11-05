<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <p class="author-name">{{ checkAuthor(props.author) }}</p>
        <p class="author-id">
          {{ checkUpdatedAt(props.author) }}
        </p>
        <div v-if="userStore.isLoggedIn()" class="buttons flex mt-4 is-justify-content-center">
          <button class="button" @click="openModal(AuthorDeleteForm)">Delete</button>
          <button class="button" @click="openModal(AuthorEditForm)">Edit</button>
        </div>
      </div>
      <Modal ref="modalRef" @update="emit('update')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import type { Component } from 'vue'
import type { Author } from '@/types/Author'
import { checkAuthor, checkUpdatedAt } from '@/utils/stringUtils'
import Modal from '../Modal.vue'
import AuthorDeleteForm from './AuthorDeleteForm.vue'
import AuthorEditForm from './AuthorEditForm.vue'
import { useUserStore } from '@/store/Auth'
import { checkIfAuthenticated } from '@/utils/authUtils'

const modalRef = ref()
const userStore = useUserStore()
const emit = defineEmits(['update'])

const UNAUTHORIZED_MESSAGE = 'You are not authorized to modify this author.'

const props = defineProps<{
  author: Author
}>()

const openModal = (ViewComponent: Component) => {
  if (!checkIfAuthenticated(UNAUTHORIZED_MESSAGE)) return
  modalRef.value.open(ViewComponent, props)
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
  overflow: hidden;
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

.button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
