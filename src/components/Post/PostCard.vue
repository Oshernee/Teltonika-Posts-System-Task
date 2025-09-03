<template>
  <div class="card is-clickable" @click="navigateToPost">
    <div class="card-content">
      <div class="content">
        <p class="post-title">Title: {{ props.post.title }}</p>
        <p class="author-name">{{ checkAuthor(props.post.author) }}</p>
        <p class="post-id">
          {{ checkUpdatedAt(props.post) }}
        </p>
        <div class="buttons flex mt-4 is-justify-content-center">
          <button v-if="userId" class="button" @click.stop="openModal(PostDeleteForm)">
            Delete
          </button>
          <button v-if="userId" class="button" @click.stop="openModal(PostEditForm)">Edit</button>
        </div>
      </div>
    </div>
  </div>
  <Modal ref="modalRef" @update="emit('update')" />
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue'
import type { Post } from '@/types/Post'
import { useRouter } from 'vue-router'
import { checkAuthor, checkUpdatedAt } from '@/utils/stringUtils'
import Modal from '../Modal.vue'
import PostEditForm from './PostEditForm.vue'
import PostDeleteForm from './PostDeleteForm.vue'
import { useUserStore } from '@/store/Auth'
import { useNotificationStore } from '@/store/Notification'

const notificationStore = useNotificationStore()
const modalRef = ref()
const userStore = useUserStore()
const emit = defineEmits(['update'])
const router = useRouter()
const userId = computed(() => userStore.getUser()[0] as number | null)

const props = defineProps<{
  post: Post
}>()

const navigateToPost = () => {
  router.push({
    name: 'post-detail',
    params: {
      id: props.post.id,
    },
  })
}

const openModal = (ViewComponent: any) => {
  if (!userId) {
    notificationStore.addNotification({
      type: 'error',
      message: `You are not authorized to modify this post.`,
    })
    return
  }
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
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
  border-color: #667eea;
}

.card-content {
  padding: 0.25rem;
}

.post-title {
  color: #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  height: 3.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-name {
  color: #a0aec0;
  font-size: 1rem;
  margin-bottom: 0.2rem;
  font-weight: 500;
}

.post-id {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0;
  font-style: italic;
}

.is-clickable {
  cursor: pointer;
}

.is-clickable:active {
  transform: translateY(-2px);
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
