<template>
  <div id="app">
    <div class="login-page">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4">
            <div class="box login-box" v-bind:class="{ 'has-error': emptyFields }">
              <div class="has-text-centered mb-5">
                <h1 class="title is-3">Sign In</h1>
                <p class="subtitle is-6 has-text-grey">Welcome back</p>
              </div>
              <form @submit.prevent="doLogin">
                <div class="field">
                  <div class="control has-icons-left">
                    <textarea
                      v-model="emailLogin"
                      class="textarea is-medium has-fixed-size"
                      placeholder="Enter your email"
                      rows="1"
                      required
                    ></textarea>
                    <span class="icon is-small is-left">
                      <i class="fas fa-envelope"></i>
                    </span>
                  </div>
                </div>
                <div class="field">
                  <div class="control has-icons-left">
                    <textarea
                      v-model="passwordLogin"
                      class="textarea is-medium has-fixed-size"
                      placeholder="Enter your password"
                      rows="1"
                      required
                    ></textarea>
                    <span class="icon is-small is-left">
                      <i class="fas fa-lock"></i>
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

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '@/types/User'
</script>

<style scoped>
.login-page {
  height: 80vh;
  padding: 2rem 0;
  display: flex;
  align-items: center;
}

.login-box {
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.login-box.has-error {
  border: 2px solid #ff3860;
}

.textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.125em rgba(102, 126, 234, 0.25);
}

.button.is-primary {
  background-color: #667eea;
  border-color: transparent;
}

.button.is-primary:hover {
  background-color: #5a6fd8;
}
</style>
