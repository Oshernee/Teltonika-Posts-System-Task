<template>
  <div class="form-container">
    <div class="has-text-centered mb-5">
      <h2 class="title is-3 has-text-light">Create New Author</h2>
      <p class="subtitle is-6 has-text-grey-light">Add a new author to the system</p>
    </div>
    <Form @submit="handleSubmit" v-slot="{ meta, values, resetForm }" ref="formRef">
      <div class="field">
        <label class="label has-text-light" for="name">Name</label>
        <div class="control">
          <Field
            name="name"
            v-slot="{ field, meta, errorMessage }"
            rules="required|length|only_letters_and_spaces|first_letter_uppercase"
            :validateOnValueUpdate="true"
          >
            <input
              v-bind="field"
              class="input is-medium is-dark"
              :class="{ 'is-danger': errorMessage && meta.touched }"
              type="text"
              id="name"
              placeholder="Enter author's name"
              required
            />
          </Field>
        </div>
        <ErrorMessage name="name" class="help is-danger">
          <template #default="{ message }">
            <p class="help is-danger error-text">
              <i class="fas fa-exclamation-triangle"></i>
              {{ message }}
            </p>
          </template>
        </ErrorMessage>
      </div>

      <div class="field">
        <label class="label has-text-light" for="surname">Surname</label>
        <div class="control">
          <Field
            name="surname"
            v-slot="{ field, meta, errorMessage }"
            rules="required|length|only_letters_and_spaces|first_letter_uppercase"
            :validateOnValueUpdate="true"
          >
            <input
              v-bind="field"
              class="input is-medium is-dark"
              :class="{ 'is-danger': errorMessage && meta.touched }"
              type="text"
              id="surname"
              placeholder="Enter author's surname"
              required
            />
          </Field>
        </div>
        <ErrorMessage name="surname" class="help is-danger">
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
          <label class="checkbox has-text-light custom-checkbox">
            <Field name="isPublished" type="checkbox" v-slot="{ field }">
              <input v-bind="field" type="checkbox" class="checkbox-input" />
              <span class="checkmark"></span>
            </Field>
            <span class="checkbox-label">Redirect after creation</span>
          </label>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button
            type="submit"
            class="button is-primary is-medium is-fullwidth"
            :class="{ 'is-loading': isLoading }"
            :disabled="isLoading"
          >
            Create Author
          </button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { defineRule, Form, Field, ErrorMessage } from 'vee-validate'
import { required } from '@vee-validate/rules'
import { ref, reactive, onMounted } from 'vue'
import { useNotificationStore } from '@/store/Notification'
import AuthorService from '@/services/authorService'
import { useUserStore } from '@/store/Auth'
import type { Author } from '@/types/Author'

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const isLoading = ref(false)
const formRef = ref()
const emit = defineEmits(['update', 'close', 'updateCurrent'])
const authors = ref<Array<Author>>([])

defineRule('required', required)

onMounted(async () => {
  try {
    const [userId, token] = userStore.getUser()
    if (userId === null || token === null) {
      notificationStore.addNotification({
        type: 'error',
        message: `You are not authorized to create an author.`,
      })
      emit('close')
      return
    }
    const fetchedAuthors = await AuthorService.getAuthorsByUserId(Number(userId))
    authors.value = fetchedAuthors
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      message: `Error fetching authors: ${error}`,
    })
  }
})

const handleSubmit = async (values: any, { resetForm }: any) => {
  isLoading.value = true
  const [userId, token] = userStore.getUser()
  const shouldRedirect = values.isPublished
  try {
    if (userId === null || token === null) {
      notificationStore.addNotification({
        type: 'error',
        message: `You are not authorized to create an author.`,
      })
      emit('close')
      return
    }
    const normalizedName = values.name.trim().replace(/\s+/g, ' ')
    const normalizedSurname = values.surname.trim().replace(/\s+/g, ' ')

    await AuthorService.createAuthor(
      String(token),
      Number(userId),
      normalizedName,
      normalizedSurname,
    )

    notificationStore.addNotification({
      type: 'success',
      message: `Author created successfully`,
    })

    if (!shouldRedirect) {
      emit('update')
    } else {
      emit('updateCurrent')
    }
    emit('close')
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      message: `Error creating author: ${error}`,
    })
  } finally {
    isLoading.value = false
  }
}

defineRule('length', (value: string) => {
  const normalizedValue = value.trim().replace(/\s+/g, ' ')
  return (
    (normalizedValue.length >= 4 && normalizedValue.length <= 25) ||
    'Must be between 4 and 25 characters'
  )
})

defineRule('only_letters_and_spaces', (value: string) => {
  const regex = /^[A-Za-z\s]+$/
  return regex.test(value) || 'Only letters and spaces are allowed'
})

defineRule('first_letter_uppercase', (value: string) => {
  if (!value || value.length === 0) return true
  const trimmedValue = value.trim()
  if (trimmedValue.length === 0) return true
  return (
    trimmedValue.charAt(0) === trimmedValue.charAt(0).toUpperCase() ||
    'First letter must be uppercase'
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
.custom-checkbox {
  position: relative;
  display: inline-block;
  cursor: pointer;
  user-select: none;
  padding-left: 2rem;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1.5rem;
  width: 1.5rem;
  background-color: #34495e;
  border: 2px solid #4a5568;
  border-radius: 4px;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #667eea;
  border-color: #667eea;
}

.checkbox-label {
  color: #e2e8f0;
  font-weight: 500;
  margin-left: 0.5rem;
  line-height: 1.5rem;
}
</style>
