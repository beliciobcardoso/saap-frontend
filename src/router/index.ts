import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { layout: 'auth', requiresAuth: false },
  },
  {
    path: '/public/confirm',
    name: 'PublicConfirm',
    component: () => import('@/pages/PublicConfirmPage.vue'),
    meta: { layout: 'none', requiresAuth: false },
  },
  {
    path: '/',
    redirect: '/dashboard',
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
  },
  {
    path: '/appointments',
    name: 'Appointments',
    component: () => import('@/pages/AppointmentsPage.vue'),
    meta: { requiresAuth: true, title: 'Agendamentos' },
  },
  {
    path: '/appointments/:id',
    name: 'AppointmentDetail',
    component: () => import('@/pages/AppointmentDetailPage.vue'),
    meta: { requiresAuth: true, title: 'Detalhes do Agendamento' },
  },
  {
    path: '/patients',
    name: 'Patients',
    component: () => import('@/pages/PatientsPage.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN', 'RECEPTIONIST'], title: 'Pacientes' },
  },
  {
    path: '/professionals',
    name: 'Professionals',
    component: () => import('@/pages/ProfessionalsPage.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Profissionais' },
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('@/pages/ServicesPage.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Serviços' },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/pages/UsersPage.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Usuários' },
  },
  {
    path: '/audit-logs',
    name: 'AuditLogs',
    component: () => import('@/pages/AuditLogsPage.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Auditoria' },
  },
  {
    path: '/queue',
    name: 'Queue',
    component: () => import('@/pages/QueuePage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN', 'PROFESSIONAL'],
      layout: 'queue',
      title: 'Fila de Atendimento',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && authStore.userRole) {
    const allowed = to.meta.roles as string[]
    if (!allowed.includes(authStore.userRole)) {
      return { name: 'Dashboard' }
    }
  }

  if (to.name === 'Login' && authStore.isAuthenticated) {
    return { name: 'Dashboard' }
  }
})

export default router
