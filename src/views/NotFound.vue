<template>
  <section class="hero not-found-page">
    <div class="hero-body">
      <div class="container has-text-centered mt-5 pt-6">
        <h1 class="title is-1 has-text-light mt-5 pt-6" style="font-size: 10rem">404</h1>
        <h2 class="subtitle is-3 has-text-grey-light">Puslapis nerastas</h2>
        <router-link to="/" custom v-slot="{ navigate }">
          <button @click="navigate" class="button is-primary is-medium mt-4">
            Grįžti į pradžią
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 56px);
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
}

.hero-body {
  padding: 3rem 1.5rem;
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

.button.is-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}
</style>
