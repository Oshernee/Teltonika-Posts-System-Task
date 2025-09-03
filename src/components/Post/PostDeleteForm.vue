<template>
  <div class="form-container">
    <div class="has-text-centered mb-5">
      <h2 class="title is-3 has-text-light">Delete Post</h2>
      <p class="subtitle is-6 has-text-grey-light">Are you sure you want to delete this post?</p>
    </div>

    <div class="post-info mb-5">
      <div class="field">
        <label class="label has-text-light">Title</label>
        <div class="control">
          <p class="post-display">{{ props.post.title }}</p>
        </div>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <button
          type="button"
          @click="handleSubmit"
          class="button is-danger is-medium is-fullwidth"
          :class="{ 'is-loading': isLoading }"
          :disabled="isLoading"
        >
          Delete Post
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotificationStore } from '@/store/Notification'
import PostService from '@/services/postService'
import { useUserStore } from '@/store/Auth'
import type { Post } from '@/types/Post'

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const isLoading = ref(false)
const emit = defineEmits(['update', 'close', 'delete'])

const props = defineProps<{
  post: Post
}>()

onMounted(() => {
  const [userId, token] = userStore.getUser()
  if (userId === null || token === null) {
    notificationStore.addNotification({
      type: 'error',
      message: `You are not authorized to delete the post.`,
    })
    emit('close')
    return
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  const [userId, token] = userStore.getUser()
  try {
    if (userId === null || token === null) {
      notificationStore.addNotification({
        type: 'error',
        message: `You are not authorized to delete the post.`,
      })
      emit('close')
      return
    }

    await PostService.deletePost(String(token), Number(props.post.id))

    notificationStore.addNotification({
      type: 'success',
      message: `Post deleted successfully`,
    })

    emit('delete')
    emit('update')
    emit('close')
  } catch (error: Error | any) {
    notificationStore.addNotification({
      type: 'error',
      message: `Error deleting post: ${error}`,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.form-container {
  padding: 2rem;
  min-width: 400px;
}

.post-info {
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.post-display {
  font-size: 1.125rem;
  color: #e2e8f0;
  font-weight: 500;
  border: 1px solid #4a5568;
  padding: 0.75rem;
  border-radius: 4px;
}

.label.has-text-light {
  color: #e2e8f0 !important;
  font-weight: 600;
}

.title.has-text-light {
  color: #e2e8f0 !important;
}

.subtitle.has-text-grey-light {
  color: #a0aec0 !important;
}

.button.is-danger {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  border-color: transparent;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
  transition: all 0.3s ease;
}

.button.is-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 62, 62, 0.4);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
