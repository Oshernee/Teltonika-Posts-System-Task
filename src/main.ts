import { createApp } from 'vue'
import App from './App.vue'
import { pinia } from './store'
import router from './router'
import 'bulma/css/bulma.css'

createApp(App).use(router).use(pinia).mount('#app')
