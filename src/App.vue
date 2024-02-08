<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <main class="flex min-h-screen justify-center px-[5%]" :class="{'items-center': route.name=='home', 'items-stretch': route.name == 'chat' }">
    <RouterView />
  </main>
</template>