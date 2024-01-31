import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { VueQueryPlugin } from 'vue-query'

const app = createApp(App)
app.use(VueQueryPlugin)
app.mount('#app')
