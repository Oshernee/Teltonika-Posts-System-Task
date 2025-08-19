<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container has-text-centered mt-5 pt-6">
        <h1 class="title is-1 has-text-danger mt-5 pt-6" style="font-size: 10rem">404</h1>
        <h2 class="subtitle is-3 has-text-dark">Puslapis nerastas</h2>
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
.hero {
  min-height: calc(90vh - 3.25rem);
}
</style>
