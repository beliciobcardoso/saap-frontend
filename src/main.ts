import { createApp } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'
import './styles/tokens.css'
import './styles/animations.css'
import './styles/typography.css'
import './styles/global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: (failureCount, error: unknown) => {
        const axiosError = error as { response?: { status: number } }
        if (axiosError?.response?.status === 404) return false
        if (axiosError?.response?.status === 403) return false
        return failureCount < 2
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
