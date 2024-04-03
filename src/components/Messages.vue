<script setup lang="ts">
    import { ref, unref, onUpdated, onMounted, computed } from 'vue'
    import { useQuery, useQueryClient } from '@tanstack/vue-query'
    import { useChatStore } from '@/stores/chat'
    import type { Message, PendingMessage, SendMessage  } from '@/stores/interfaces'
    const props = defineProps({
        username: String,
    })

    const chatStore = useChatStore()
    const selected_index = ref()

    // this works to pull from cache
    const { data: selected_msg } = useQuery({
        queryKey: ['messages', 'individual', selected_index],  // docs say put the ref (not .value)
        //queryFn: () => { return {} },  // without a return we get `Query data cannot be undefined.`
        //queryFn: () => {},  // but if i return something, i dont read from cache
        // BUT we can entirely omit the queryFn and get no errors with a cache read
        staleTime: Infinity,
        cacheTime: Infinity,
    })

    // be sure to separate the reactive state of typed messages from what is sent across the wire
    const new_message: Ref = ref<string>('')
    function send() {
        if (new_message.value) {
            chatStore.send_message(unref(props.username), new_message.value)
            new_message.value = ''  // so we can blank out the input after send while message is in flight
        }  // no need to error on blank string here
    }

    const chatlist = ref(null)
    const msg_input = ref(null)

    function scrollToLatest() {
        chatlist.value.scrollTop = chatlist.value.scrollHeight
    }

    function logMessage(index) {
        // reactivity PLZ
        selected_index.value = index
    }

    // change this to a watcher on messages
    onUpdated(() => {
        scrollToLatest()
    })
    onMounted(() => {
        scrollToLatest()
        msg_input.value.focus()
    })
</script>

<template>
    <section class="flex-1 bg-si-green">
        <!-- NOTE: justify end, so chat messages start at the bottom (not the top)-->
        <div class="flex flex-col justify-end h-screen">
            <!-- overflow for a scroll bar, since the parent has a height -->
            <div class="px-2 overflow-y-auto" ref="chatlist">
                <p>selected msg: {{ selected_msg }}</p>
                <ol>
                    <!-- Apparently this doesn't work with above either -->
                    <!-- <li v-for="msg in messages.data" :key="msg.index" @click="logMessage(msg)"> -->
                    <!-- The ONLY way this works is with destructuring -->
                    <li v-for="msg in chatStore.messages" :key="msg.index" @click="logMessage(msg.index)">
                        {{ msg }}
                    </li>
                    <!-- always put pending msgs "last"-->
                    <li class="pending italic" v-for="message in chatStore.pending_messages" :key="message.index">
                        <span>{{message.user.name}}</span>
                        {{message.message}}
                    </li>
                </ol>
            </div>
            <div class="flex-none p-5 border-x-0">
                <div class="flex">
                    <input type="text" class="flex-1 mx-1" v-model='new_message' @keyup.enter="send" ref="msg_input" />
                    <button class="flex-none mx-1" @click="send">Send</button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    li.pending {
        color: rgb(200, 200, 200);
    }
    ol li span::after {
        content: ':';
    }
</style>