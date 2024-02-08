<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')

function setUser() {
    if (username.value) {
        // send to the back end
        // set in a store
        router.push('/chat')
    } else {
        alert('Please enter a username') // TODO replace with error in the UI
    }
}
</script>

<template>
    <p>Login here</p>
</template>
