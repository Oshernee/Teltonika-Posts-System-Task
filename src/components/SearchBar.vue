<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="field">
          <div class="control">
            <input
              class="input is-medium"
              type="text"
              v-model="input"
              placeholder="Search "
              v-on:input="debouncedInput(input)"
            />
          </div>
        </div>
        <div class="notification is-danger" v-if="input && props.count === 0">
          <p>No results found!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'debounce'

let input = ref('')
const emit = defineEmits(['input-changed'])

const props = defineProps<{
  count: number
}>()

const debouncedInput = debounce((value: string) => {
  input.value = value
  emit('input-changed', value)
}, 300)
</script>

<style scoped>
.container {
  padding-top: 2rem;
}

.box {
  margin-bottom: 0.75rem;
  transition: transform 0.2s ease;
}
</style>
