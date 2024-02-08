import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

const USERNAME: string = 'username'

export const useUserStore = defineStore('user', () => {
    const username: Ref = ref<string | null>(null)
    // NOTE: this is session storage b/c we are testing with multiple tabs (e.g. two users same host machine)
    // in "the real world" this would be localStorage
    const stored_username: string | null = sessionStorage.getItem(USERNAME)

    function set_username(name: string): void {
        username.value = name
        sessionStorage.setItem(USERNAME, name)
        // fetch POST
    }

    return { username, stored_username, set_username }
})