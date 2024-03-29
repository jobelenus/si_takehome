<script setup lang="ts">
    import { useUserStore } from '@/stores/user'
    import { useChatStore } from '@/stores/chat'
    const chatStore = useChatStore()
    const userStore = useUserStore()
    import UserList from '../components/UserList.vue'
    import Messages from '../components/Messages.vue'

    chatStore.load()
</script>

<template>
    <!-- in general I prefer that components dont necessarily perform data lookup -->
    <!-- stores are better suited to that, and it allows more easy component testing -->
    <!-- even if it does sometimes make the prop list long :/ -->
    <UserList :username="userStore.username" :users="chatStore.users" />
    <Messages :username="userStore.username"/>
</template>

