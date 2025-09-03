<template>
  <div class="form-container">
    <div class="has-text-centered mb-5">
      <h2 class="title is-3 has-text-light">Edit Post</h2>
      <p class="subtitle is-6 has-text-grey-light">Modify the post details below</p>
    </div>
    <Form @submit="handleSubmit" v-slot="{ meta, values, resetForm }" ref="formRef">
      <div class="field">
        <label class="label has-text-light" for="name">Title</label>
        <div class="control">
          <Field
            name="title"
            v-model="localPost.title"
            v-slot="{ field, meta, errorMessage }"
            rules="required|first_letter_uppercase|length"
            :validateOnValueUpdate="true"
          >
            <input
              v-bind="field"
              class="input is-medium is-dark"
              :class="{ 'is-danger': errorMessage && meta.touched }"
              type="text"
              id="title"
              placeholder="Enter post title"
              required
            />
          </Field>
        </div>
        <ErrorMessage name="title" class="help is-danger">
          <template #default="{ message }">
            <p class="help is-danger error-text">
              <i class="fas fa-exclamation-triangle"></i>
              {{ message }}
            </p>
          </template>
        </ErrorMessage>
      </div>

      <div class="field">
        <label class="label has-text-light" for="content">Content</label>
        <div class="control">
          <Field
            name="content"
            v-slot="{ field, meta, errorMessage }"
            rules="required"
            :value="localPost.body"
          >
            <textarea
              v-bind="field"
              class="textarea is-medium is-dark"
              :class="{ 'is-danger': errorMessage && meta.touched }"
              id="content"
              placeholder="Enter post content"
              required
              v-model="localPost.body"
            ></textarea>
          </Field>
        </div>
        <ErrorMessage name="content" class="help is-danger">
          <template #default="{ message }">
            <p class="help is-danger error-text">
              <i class="fas fa-exclamation-triangle"></i>
              {{ message }}
            </p>
          </template>
        </ErrorMessage>
      </div>
      <div class="field">
        <div class="control">
          <button
            type="submit"
            class="button is-primary is-medium is-fullwidth"
            :class="{ 'is-loading': isLoading }"
            :disabled="isLoading"
          >
            Edit Post
          </button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { defineRule, Form, Field, ErrorMessage } from 'vee-validate'
import { required } from '@vee-validate/rules'
import { ref, onMounted } from 'vue'
import { useNotificationStore } from '@/store/Notification'
import PostService from '@/services/postService'
import { useUserStore } from '@/store/Auth'
import type { Post } from '@/types/Post'

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const isLoading = ref(false)
const formRef = ref()
const emit = defineEmits(['update', 'close'])

const props = defineProps<{
  post: Post
}>()

const localPost = ref<Post>({ ...props.post })

defineRule('required', required)

const handleSubmit = async (values: any) => {
  isLoading.value = true
  const [userId, token] = userStore.getUser()
  try {
    if (userId === null || token === null) {
      notificationStore.addNotification({
        type: 'error',
        message: `You are not authorized to update a post.`,
      })
      return
    }

    if (props.post.title === localPost.value.title && props.post.body === localPost.value.body) {
      notificationStore.addNotification({
        type: 'info',
        message: `No changes detected.`,
      })
      return
    }

    notificationStore.addNotification({
      type: 'success',
      message: `Post updated successfully`,
    })

    await PostService.editPost(String(token), Number(userId), values.title, values.content)

    emit('update')
    emit('close')
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      message: `Error updating post: ${error}`,
    })
  } finally {
    isLoading.value = false
  }
}

defineRule('first_letter_uppercase', (value: string) => {
  if (!value || value.length === 0) return true
  const trimmedValue = value.trim()
  if (trimmedValue.length === 0) return true
  return (
    trimmedValue.charAt(0) === trimmedValue.charAt(0).toUpperCase() ||
    'First letter must be uppercase'
  )
})

defineRule('length', (value: string) => {
  const normalizedValue = value.trim().replace(/\s+/g, ' ')
  return (
    (normalizedValue.length >= 4 && normalizedValue.length <= 50) ||
    'Must be between 4 and 50 characters'
  )
})
</script>

<style scoped>
.form-container {
  padding: 2rem;
  min-width: 400px;
}

.error-text {
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #ff6b6b !important;
  background-color: rgba(255, 107, 107, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border-left: 4px solid #ff6b6b;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-text i {
  color: #ff6b6b;
  font-size: 1.1rem;
}

.input.is-dark {
  background-color: #34495e;
  border-color: #4a5568;
  color: #e2e8f0;
}

.input.is-dark::placeholder {
  color: #a0aec0;
}

.input.is-dark:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.125em rgba(102, 126, 234, 0.25);
  background-color: #2d3748;
}

.textarea.is-dark {
  background-color: #34495e;
  border-color: #4a5568;
  color: #e2e8f0;
  resize: vertical;
  min-height: 120px;
}

.textarea.is-dark::placeholder {
  color: #a0aec0;
}

.textarea.is-dark:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.125em rgba(102, 126, 234, 0.25);
  background-color: #2d3748;
}

.select.is-dark select {
  background-color: #34495e;
  border-color: #4a5568;
  color: #e2e8f0;
  width: 100%;
}

.select.is-dark select option {
  background-color: #34495e;
  color: #e2e8f0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select.is-dark::after {
  border-color: #e2e8f0;
}

.select.is-dark select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.125em rgba(102, 126, 234, 0.25);
  background-color: #2d3748;
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

.button.is-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.button.is-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
