<template>
  <h1>404</h1>
  <h2>Puslapis nerastas</h2>
  <router-link to="/" custom v-slot="{ navigate }">
    <button @click="navigate">Grįžti į pradžią</button>
  </router-link>
</template>

<style scoped>
h1 {
  color: red;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 2rem;
  font-size: 10em;
}
h2 {
  text-align: center;
  color: black;
  margin-bottom: 1rem;
}
router-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: blue;
  text-decoration: none;
}
router-link:hover {
  text-decoration: underline;
}
button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
