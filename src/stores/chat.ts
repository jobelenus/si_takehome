import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Reactive } from 'vue'
import type { User, Message } from '@/stores/interfaces'


// we need a type for the websocket
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

    function load():void {
        // init websockets and fetch state
    }

    return {users, messages, load }
})
