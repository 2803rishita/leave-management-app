import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/employee',
    component: () => import('@/views/layouts/EmployeeLayout.vue'),
    meta: { requiresAuth: true, role: 'employee' },
    children: [
      {
        path: '',
        redirect: '/employee/dashboard'
      },
      {
        path: 'dashboard',
        name: 'EmployeeDashboard',
        component: () => import('@/views/employee/DashboardView.vue')
      },
      {
        path: 'apply',
        name: 'ApplyLeave',
        component: () => import('@/views/employee/ApplyLeaveView.vue')
      },
      {
        path: 'my-leaves',
        name: 'MyLeaves',
        component: () => import('@/views/employee/MyLeavesView.vue')
      }
    ]
  },
  {
    path: '/employer',
    component: () => import('@/views/layouts/EmployerLayout.vue'),
    meta: { requiresAuth: true, role: 'employer' },
    children: [
      {
        path: '',
        redirect: '/employer/dashboard'
      },
      {
        path: 'dashboard',
        name: 'EmployerDashboard',
        component: () => import('@/views/employer/DashboardView.vue')
      },
      {
        path: 'requests',
        name: 'LeaveRequests',
        component: () => import('@/views/employer/LeaveRequestsView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/login')
    }
    if (to.meta.role && authStore.user?.role !== to.meta.role) {
      const redirect = authStore.isEmployee ? '/employee/dashboard' : '/employer/dashboard'
      return next(redirect)
    }
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    const redirect = authStore.isEmployee ? '/employee/dashboard' : '/employer/dashboard'
    return next(redirect)
  }

  next()
})

export default router
