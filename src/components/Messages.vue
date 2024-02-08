<script setup lang="ts">
    import { ref, unref, onUpdated, onMounted } from 'vue'
    import type { Message, PendingMessage, SendMessage  } from '@/stores/interfaces'
    const props = defineProps({
        username: String,
        messages: Array<Message>,
        pendingMessages: Array<PendingMessage>,
        sendMessage: Function<SendMessage>
    })

    // be sure to separate the reactive state of typed messages from what is sent across the wire
    const new_message: Ref = ref<string>('')
    function send() {
        if (new_message.value) {
            props.sendMessage(unref(props.username), new_message.value)
            new_message.value = ''  // so we can blank out the input after send while message is in flight
        }  // no need to error on blank string here
    }

    const chatlist = ref(null)

    function scrollToLatest() {
        chatlist.value.scrollTop = chatlist.value.scrollHeight
    }

    onUpdated(() => {
        scrollToLatest()
    })
    onMounted(() => {
        scrollToLatest()
    })
</script>

<template>
    <section class="flex-1 bg-si-green">
        <!-- NOTE: justify end, so chat messages start at the bottom (not the top)-->
        <div class="flex flex-col justify-end h-screen">
            <!-- overflow for a scroll bar, since the parent has a height -->
            <div class="px-2 overflow-y-auto" ref="chatlist">
                <ol>
                    <li v-for="message in props.messages">
                        <span>{{message.user.name}}</span>
                        {{message.message}}
                    </li>
                    <!-- always put pending msgs "last"-->
                    <li class="pending italic" v-for="message in props.pendingMessages">
                        <span>{{message.user.name}}</span>
                        {{message.message}}
                    </li>
                </ol>
            </div>
            <div class="flex-none p-5 border-x-0">
                <div class="flex">
                    <input type="text" class="flex-1 mx-1" v-model='new_message' @keyup.enter="send" />
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