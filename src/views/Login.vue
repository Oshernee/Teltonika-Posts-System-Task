<template>
  <div id="app">
    <div class="login-page">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4">
            <div class="box login-box" v-bind:class="{ 'has-error': emptyFields }">
              <div class="has-text-centered mb-5">
                <h1 class="title is-3 has-text-light">Sign In</h1>
                <p class="subtitle is-6 has-text-grey-light">Welcome back</p>
              </div>
              <form @submit.prevent="doLogin">
                <div class="field">
                  <div class="control has-icons-left">
                    <input
                      v-model="emailLogin"
                      class="input is-medium has-fixed-size is-dark"
                      placeholder="Enter your email"
                      type="email"
                      rows="1"
                      required
                    ></input>
                    <span class="icon is-small is-left">
                      <img :src="envelope" alt="email icon" />
                    </span>
                  </div>
                </div>
                <div class="field">
                  <div class="control has-icons-left">
                    <input
                      v-model="passwordLogin"
                      class="input is-medium has-fixed-size is-dark"
                      type="password"
                      placeholder="Enter your password"
                      rows="1"
                      required
                    ></input>
                    <span class="icon is-small is-left">
                      <img :src="password" alt="password icon" />
                    </span>
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <button type="submit" class="button is-primary is-medium is-fullwidth">
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserService from '@/services/loginService'
import { useUserStore } from '@/store/Auth'
import envelope from '@/assets/email.svg'
import password from '@/assets/password.svg'

const router = useRouter()
const userStore = useUserStore()

const emailLogin = ref('')
const passwordLogin = ref('')
const emptyFields = ref(false)

const doLogin = async () => {
  emptyFields.value = !emailLogin.value || !passwordLogin.value
  if (emptyFields.value) return

  const [user, accesstoken] = await UserService.userLogin(emailLogin.value, passwordLogin.value)

  if (user && accesstoken) {
    userStore.setUser(user, accesstoken)
    router.push('/posts')
  } else {
    emptyFields.value = true
  }
}
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

.button.is-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.button.is-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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
