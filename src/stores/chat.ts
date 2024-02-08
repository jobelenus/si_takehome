import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Reactive } from 'vue'
import type { User, Message, SendMessage, PendingMessage } from '@/stores/interfaces'


// we need types for the websocket
enum KIND {
    SIGNIN = 'signIn',
    MSG = 'message'
}

interface WSPayload {
    kind: KIND
    user: string
    index?: number
    message?: string
}

export const useChatStore = defineStore('chat', () => {
    const users: Reactive<Array<User>> = reactive([])
    const messages: Reactive<Array<Message>> = reactive([])
    const pending_messages: Reactive<Array<PendingMessage>> = reactive([])

    function load():void {
        // init websockets and fetch state
    }

    function send_message(...[username, msg]: Parameters<SendMessage>): ReturnType<SendMessage> {
        const user: User = {name: username}
        const message: PendingMessage = {user: user, message: msg}
        pending_messages.push(message)
        // fetch POST
    }

    return {users, messages, load, send_message, pending_messages }
})
