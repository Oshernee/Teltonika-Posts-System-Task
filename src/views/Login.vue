<template>
  <div id="app">
    <div class="login-page">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4">
            <div class="box login-box" v-bind:class="{ 'has-error': !meta.valid && meta.dirty }">
              <div class="has-text-centered mb-5">
                <h1 class="title is-3 has-text-light">Sign In</h1>
                <p class="subtitle is-6 has-text-grey-light">Welcome back</p>
              </div>
              <Form
                @submit="(values) => doLogin({ email: values.email, password: values.password })"
                v-slot="{ meta, values }"
              >
                <div class="field">
                  <div class="control has-icons-left">
                    <Field
                      name="email"
                      v-slot="{ field, meta, errorMessage }"
                      rules="required|no_exclamation_after_at|email_type"
                    >
                      <input
                        v-bind="field"
                        class="input is-medium has-fixed-size is-dark"
                        :class="{ 'is-danger': errorMessage && meta.touched }"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </Field>
                    <span class="icon is-small is-left">
                      <img :src="envelope" alt="email icon" />
                    </span>
                  </div>
                  <ErrorMessage name="email" class="help is-danger">
                    <template #default="{ message }">
                      <p class="help is-danger">
                        <i class="fas fa-exclamation-triangle"></i>
                        {{ message }}
                      </p>
                    </template>
                  </ErrorMessage>
                </div>
                <div class="field">
                  <div class="control has-icons-left">
                    <Field
                      name="password"
                      v-slot="{ field, meta, errorMessage }"
                      rules="required|length|lowercase"
                    >
                      <input
                        v-bind="field"
                        class="input is-medium has-fixed-size is-dark"
                        :class="{ 'is-danger': errorMessage && meta.touched }"
                        type="password"
                        placeholder="Enter your password"
                      />
                    </Field>
                    <span class="icon is-small is-left">
                      <img :src="password" alt="password icon" />
                    </span>
                  </div>
                  <ErrorMessage name="password" class="help is-danger">
                    <template #default="{ message }">
                      <p class="help is-danger">
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
                      :disabled="!meta.valid"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineRule, Form, Field, ErrorMessage, useForm } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'
import { useRouter } from 'vue-router'
import UserService from '@/services/loginService'
import { useUserStore } from '@/store/Auth'
import envelope from '@/assets/email.svg'
import password from '@/assets/password.svg'
import { useNotificationStore } from '@/store/Notification'

const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)

const { meta, setFieldError } = useForm()

const doLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const [user, accesstoken] = await UserService.userLogin(email, password)

    if (user && accesstoken) {
      userStore.setUser(user, accesstoken)
      notificationStore.addNotification({ message: 'Login successful', type: 'success' })
      router.push('/posts')
    }
  } catch (error: any) {
    let message = 'An error occurred during login. Please try again.'
    if (error.status === 500) {
      message = 'Server error. Please try again later.'
    } else if (error.status === 400) {
      message = 'Invalid email or password.'
    }
    setFieldError('email', 'Invalid credentials')
    setFieldError('password', 'Invalid credentials')
    notificationStore.addNotification({
      type: 'error',
      message,
    })
  }
}

defineRule('no_exclamation_after_at', (value: string) => {
  if (!value) return true
  const atIndex = value.indexOf('@')
  if (atIndex === -1) return true
  return value[atIndex + 1] !== '!' || "Character '!' cannot be immediately after '@'."
})

defineRule('email_type', (value: string) => {
  if (!value) return true
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(value) || 'Please enter a valid email address.'
})

defineRule('lowercase', (value: string) => {
  if (!value) return true
  return /[a-z]/.test(value) || 'Password must contain at least one lowercase letter.'
})

defineRule('length', (value: string) => {
  if (!value) return true
  return value.length >= 6 || 'Password must be at least 6 characters long.'
})
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 56px);
  padding: 2rem 0;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.login-box {
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  background-color: #2c3e50;
  border: 1px solid #34495e;
}

.login-box.has-error {
  border: 2px solid #e74c3c;
  box-shadow: 0 15px 35px rgba(231, 76, 60, 0.3);
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

.input.is-danger {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 0.125em rgba(231, 76, 60, 0.25) !important;
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

.help.is-danger {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon img {
  width: 36px;
  height: 36px;
  filter: brightness(0.8) contrast(1.2);
}

.title.has-text-light {
  color: #e2e8f0 !important;
}

.subtitle.has-text-grey-light {
  color: #a0aec0 !important;
}
</style>
