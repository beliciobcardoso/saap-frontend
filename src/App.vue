<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import QueueLayout from '@/layouts/QueueLayout.vue'

const route = useRoute()

const layout = computed(() => {
  const l = route.meta.layout as string | undefined
  if (l === 'auth') return 'auth'
  if (l === 'queue') return 'queue'
  if (l === 'none') return 'none'
  return 'app'
})
</script>

<template>
  <Toaster position="top-right" rich-colors />
  <AuthLayout v-if="layout === 'auth'">
    <RouterView />
  </AuthLayout>
  <QueueLayout v-else-if="layout === 'queue'">
    <RouterView />
  </QueueLayout>
  <template v-else-if="layout === 'none'">
    <RouterView />
  </template>
  <AppLayout v-else>
    <RouterView />
  </AppLayout>
</template>
