import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Reactive } from 'vue'
import type { User, Message, SendMessage, PendingMessage } from '@/stores/interfaces'
import { Observable } from 'rxjs';
import type { Subscriber } from 'rxjs';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useQueryClient, useMutation, useQuery } from '@tanstack/vue-query'


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

interface APIMessage {
    index: number
    user: string
    message: string
}
interface MessageList {
    messages: Array<APIMessage>
}

export const useChatStore = defineStore('chat', () => {
    const ALL_KEY = ['messages', 'all']

    const queryClient = useQueryClient()
    const users: Reactive<Array<User>> = reactive([])
    const pending_messages: Reactive<Array<PendingMessage>> = reactive([])

    // NOTE: this doesnt work, with `messages.data` in the template
    /*const messages = useQuery({ ... })*/
    // APPARENTLY, only this way
    const { data: messages } = useQuery({
        queryKey: ALL_KEY,
        //queryFn: load_messages, // started here
        // ALSO, this works if I call load_messages() once below
        staleTime: Infinity,
        cacheTime: Infinity,
        // but it all falls apart b/c the new msg isn't read reactively off the cache
    })

    async function load_users() {
        const resp = await fetch(import.meta.env.VITE_CHAT_API+'/users')
        const raw_users: UserList = await resp.json()
        users.push(...raw_users.users.map((u: string): User => { return {'name': u} }))
    }

    async function load_messages() {
        const resp = await fetch(import.meta.env.VITE_CHAT_API+'/messages')
        const raw_msgs: MessageList = await resp.json()
        const msgs = []
        for (const msg of raw_msgs.messages) {
            msgs.push(fmt_message(msg))
        }
        queryClient.setQueryData(ALL_KEY, msgs)
        return msgs
    }

    function fmt_message(msg) {
        const user: User = {'name': msg.user}
        const m: Message = { ...msg, user: user }
        return m
    }

    const { mutate: new_msg } = useMutation({
        // this is the default
        //mutationFn: (msg: WSPayload) => Promise.resolve(msg),
        //onSuccess: (msg: WSPayload) => {
        // can avoid a boilerplate by catching it here
        onMutate: (msg) => {  // i tried this, didnt work at all
            const m = fmt_message(msg)
            queryClient.setQueryData(ALL_KEY, (old_data: Array<Message>) => {
                // this must be an immutable operation
                // this is what I was doing wrong!
                return [ ...old_data, m]
            })
            // dont need to even invalidate (it wouldn't do anything without a fetcher)
        }
    })

    async function load(): Promise<void> {
        load_users()
        load_messages()

        const ws_listener: Observable = new Observable((subscriber: Subscriber): void => {
            const rws = new ReconnectingWebSocket(import.meta.env.VITE_CHAT_WS+'/ws');  // had to look at the rust code to find that `ws` endpoint
            rws.addEventListener('open', () => {
                console.log('WS up')
            });
            rws.addEventListener('message', (payload: MessageEvent) => {
                const data = JSON.parse(payload.data)
                subscriber.next(data)
            });
        })

        ws_listener.subscribe({
            error(err: any) {
                console.error('Subscribe error', err)
            },
            next(data: WSPayload) {
                if (data.kind == KIND.SIGNIN) {
                    const user: User = {name: data.user}
                    users.push(user)
                } else if (data.kind == KIND.MSG) {

                    // not entirely happy with this typing check *thinking*
                    if ((!('index' in data) || data.index == undefined) || !data.message) {
                        throw new Error('Payload expected to have index and message')
                    }
                    // remove incoming message from pending messages, and add the message to the chat
                    // should happen within one render/paint so a user shouldn't see duplicate messages
                    pending_messages.forEach((value: PendingMessage, index:number, array:Reactive<Array<PendingMessage>>) => {
                        if (value.user.name == data.user && value.message == data.message) {
                            array.splice(index, 1)
                        }
                    })

                    new_msg(data)
                } else {
                    console.error('Unrecognized data over the websocket', data)
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
        if (!resp.ok) {
            alert('Error sending message!')  // TODO error handling
        }

    }

    return {users, load, send_message, load_messages, pending_messages, ALL_KEY, messages }
})
