import './assets/output.css'

import { createApp, unref } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'


import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'

const app = createApp(App)

app.use(createPinia())
app.use(VueQueryPlugin)
app.use(router)

const userStore = useUserStore()

router.beforeEach((to, from, next) => {
    // if you don't have a username in the store you're not logged in and cannot access the chat
    const username = unref(userStore.username)
    if (to.name != 'home' && !username) {
        next('/')
    } else {
        next()
    }
})

app.mount('#app')
