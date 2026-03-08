<template>
  <div class="min-h-screen bg-surface-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 left-0 z-30 shadow-card">
      <!-- Logo -->
      <div class="px-6 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span class="font-display font-bold text-gray-900 text-base">LeaveFlow</span>
            <p class="text-xs text-gray-400">Employer Portal</p>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-4 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ isActive, navigate }"
        >
          <div
            @click="navigate"
            :class="isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </div>
        </router-link>
      </nav>

      <!-- User info & logout -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-50 mb-2">
          <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-semibold text-emerald-700">{{ userInitial }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="btn-secondary w-full text-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 ml-64 min-h-screen">
      <div class="max-w-5xl mx-auto p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const userInitial = computed(() => authStore.user?.name?.charAt(0).toUpperCase() || 'E')

const navItems = [
  { to: '/employer/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/employer/requests', icon: '📬', label: 'Leave Requests' }
]

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
