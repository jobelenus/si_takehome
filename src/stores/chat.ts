import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Reactive } from 'vue'
import type { User, Message, SendMessage, PendingMessage } from '@/stores/interfaces'
import { Observable } from 'rxjs';
import type { Subscriber } from 'rxjs';
import ReconnectingWebSocket from 'reconnecting-websocket';


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

interface UserList {
    users: Array<string>
}

export const useChatStore = defineStore('chat', () => {
    const users: Reactive<Array<User>> = reactive([])
    const messages: Reactive<Array<Message>> = reactive([])
    const pending_messages: Reactive<Array<PendingMessage>> = reactive([])

    async function load(): Promise<void> {
        const resp = await fetch(import.meta.env.VITE_CHAT_API+'/users')
        const raw_users: UserList = await resp.json()
        users.push(...raw_users.users.map((u: string): User => { return {'name': u} }))

        const ws_listener: Observable<WSPayload> = new Observable((subscriber: Subscriber): void => {
            const rws = new ReconnectingWebSocket(import.meta.env.VITE_CHAT_WS+'/ws');  // had to look at the rust code to find that `ws` endpoint
            rws.addEventListener('open', () => {
                console.log('WS up')
            });
            rws.addEventListener('message', (payload: WSPayload) => {
                console.log('WS payload', payload)
            });
        })

        ws_listener.subscribe({
            next(data: WSPayload) {
                const user: User = {name: data.user}
                if (data.kind == KIND.SIGNIN) {
                    users.push(user)
                } else if (data.kind == KIND.MSG) {
                    // not entirely happy with this typing check *thinking*
                    if ((!('index' in data) || data.index == undefined) || !data.message) {
                        throw new Error('Payload expected to have index and message')
                    }
                    // remove incoming message from pending messages, and add the message to the chat
                    // should happen within one render/paint so a user shouldn't see duplicate messages
                    const msg: Message = {user: user, index: data.index, message: data.message}
                    pending_messages.forEach((value: PendingMessage, index:number, array:Reactive<Array<PendingMessage>>) => {
                        if (value.user.name == msg.user.name && value.message == msg.message) {
                            array.splice(index, 1)
                        }
                    })
                    messages.push(msg)
                }
            }
        })
    }

    async function send_message(...[username, msg]: Parameters<SendMessage>): ReturnType<SendMessage> {
        const user: User = {name: username}
        const message: PendingMessage = {user: user, message: msg}
        pending_messages.push(message)

        const resp = await fetch(import.meta.env.VITE_CHAT_API+'/messages', {
            method: 'POST',
            body: JSON.stringify({'user': username, 'message': msg}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('POST MSG')
        if (!resp.ok) {
            alert('Error sending message!')  // TODO error handling
        }

    }

    return {users, messages, load, send_message, pending_messages }
})
