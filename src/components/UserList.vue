<script setup lang="ts">
    import { ref, unref } from 'vue'
    import type { User } from '@/stores/interfaces'
    const props = defineProps({
        username: String,
        users: Array<User>
    })
</script>

<template>
    <section class="flex-none sm:w-32 w-56 h-75 bordered-si bg-si-green">
        <img src="/si-logo.jpg">
        <ul class="p-2">
            <li v-for="user in props.users" :key="user.name" :class="{'current-user': user.name == unref(props.username)}">
                {{user.name}}
            </li>
        </ul>
    </section>
</template>

<style scoped>
li.current-user::before {
    content: '*';
}
</style>