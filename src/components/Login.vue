<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const username: Ref = ref<string>('')

if (userStore.stored_username) {
    username.value = userStore.stored_username
}

console.log('API', import.meta.env.VITE_CHAT_API)

function setUser(): void {
    if (username.value) {
        userStore.set_username(username.value)
        router.push('/chat')
    } else {
        alert('Please enter a username') // TODO replace with error in the UI
    }
}
</script>

<template>
    <div class="my-3 mx-3 mb-4 md:flex md:flex-wrap md:justify-between">
        <!-- one downside of left/right forms is the baseline alignment of the label and input... after some fiddling with tailwind, its pretty close -->
        <!-- i might recommend changing to a "label on top of the form" layout -->
        <label for="username" class="flex leading-10 flex-col pr-2 md:w-1/3 text-right">Username</label>
        <input @keyup.enter="setUser" v-model="username" id="username" class="flex leading-3 leading-tight flex-col pl-2 md:w-2/3 appearance-none focus:outline-none focus:shadow-outline" type="text" placeholder="Person Doe">
    </div>
    <div class="mb-4 md:w-full text-right">
        <button class="mx-2" @click="setUser">Login</button>
    </div>
</template>
