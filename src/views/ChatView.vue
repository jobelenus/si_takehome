<script setup lang="ts">
    import { useUserStore } from '@/stores/user'
    import { useChatStore } from '@/stores/chat'
    const chatStore = useChatStore()
    const userStore = useUserStore()
    import UserList from '../components/UserList.vue'
    import Messages from '../components/Messages.vue'

    // chatStore.load()
</script>

<template>
    <UserList :username="userStore.username" :users="chatStore.users" />
    <Messages
        :username="userStore.username"
        :messages="chatStore.messages"
        :pending-messages="chatStore.pending_messages"
        :send-message="chatStore.send_message" />
</template>

