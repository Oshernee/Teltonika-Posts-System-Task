<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal is-active">
      <div class="modal-background" @click="close()"></div>
      <div class="modal-card">
        <button class="modal-close-btn" @click="close()" aria-label="Close modal">×</button>
        <section class="modal-card-body">
          <component
            v-if="currentComponent"
            :is="currentComponent"
            v-bind="componentProps"
            @close="close"
            @update="updatePages"
            @updateCurrent="updateCurrent"
            @delete="redirectToMain"
            v-on="$attrs"
          />
          <slot v-else></slot>
        </section>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'

const isOpen = ref(false)
const currentComponent = shallowRef(null)
const componentProps = ref({})

const emit = defineEmits<{
  close: []
  update: []
  cancel: []
  delete: []
  updateCurrent: []
  modalEvent: [eventName: string, data: any]
}>()

const open = (component: any, props = {}) => {
  currentComponent.value = component
  componentProps.value = props
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  currentComponent.value = null
  componentProps.value = {}
  emit('close')
}

const updatePages = () => {
  emit('update')
}

const updateCurrent = () => {
  emit('updateCurrent')
}

const redirectToMain = () => {
  emit('delete')
}

defineExpose({
  open,
  close,
  isOpen,
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.8);
}

.modal-card {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 8px;
  border: 1px solid #4a5568;
}

.modal-card-body {
  background: transparent;
  color: #f8f9fa;
}

.modal-close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: #f8f9fa;
  cursor: pointer;
  z-index: 10;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.modal-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-close-btn:focus {
  outline: 2px solid #4a90e2;
  outline-offset: 2px;
}
</style>
