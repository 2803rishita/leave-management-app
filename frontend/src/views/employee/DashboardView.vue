<template>
  <div class="animate-slide-up">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold text-gray-900">Good {{ timeOfDay }}, {{ firstName }}! 👋</h1>
      <p class="text-gray-500 mt-1">Here's an overview of your leave status.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" :class="stat.bg">
          <span class="text-2xl">{{ stat.icon }}</span>
        </div>
        <div>
          <p class="text-2xl font-display font-bold text-gray-900">{{ stat.value }}</p>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Recent leaves -->
    <div class="card">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-display font-bold text-gray-900">Recent Applications</h2>
        <router-link to="/employee/my-leaves" class="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors">
          View all →
        </router-link>
      </div>

      <div v-if="leaveStore.loading" class="flex items-center justify-center py-10">
        <div class="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="recentLeaves.length === 0" class="text-center py-10">
        <div class="text-4xl mb-3">📋</div>
        <p class="text-gray-500 text-sm">No leave applications yet.</p>
        <router-link to="/employee/apply" class="btn-primary mt-4 inline-flex">
          Apply for leave
        </router-link>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="leave in recentLeaves"
          :key="leave._id"
          class="flex items-center justify-between p-4 rounded-xl bg-surface-50 border border-gray-100 hover:border-gray-200 transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-lg shadow-card">
              {{ leaveTypeIcon(leave.leaveType) }}
            </div>
            <div>
              <p class="font-medium text-gray-900 text-sm">{{ leave.leaveType }} Leave</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(leave.startDate) }} – {{ formatDate(leave.endDate) }} · {{ leave.totalDays }} day{{ leave.totalDays !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <span :class="statusBadge(leave.status)">
            <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(leave.status)"></span>
            {{ leave.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick action -->
    <div class="mt-6 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-display font-bold text-lg">Need time off?</h3>
          <p class="text-brand-100 text-sm mt-0.5">Submit a leave request in under a minute.</p>
        </div>
        <router-link to="/employee/apply" class="btn bg-white text-brand-700 hover:bg-brand-50 shadow-md flex-shrink-0">
          Apply now
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useLeaveStore } from '@/store/leave'

const authStore = useAuthStore()
const leaveStore = useLeaveStore()

const firstName = computed(() => authStore.user?.name?.split(' ')[0] || 'there')

const timeOfDay = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
})

const recentLeaves = computed(() => leaveStore.leaves.slice(0, 5))

const stats = computed(() => [
  { label: 'Total Applications', value: leaveStore.leaves.length, icon: '📋', bg: 'bg-blue-50' },
  { label: 'Pending', value: leaveStore.leaves.filter(l => l.status === 'Pending').length, icon: '⏳', bg: 'bg-amber-50' },
  { label: 'Approved', value: leaveStore.leaves.filter(l => l.status === 'Approved').length, icon: '✅', bg: 'bg-emerald-50' }
])

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function leaveTypeIcon(type) {
  const icons = { Annual: '🏖️', Sick: '🤒', Maternity: '🤱', Paternity: '👨‍👶', Unpaid: '💸', Emergency: '🚨', Other: '📄' }
  return icons[type] || '📄'
}

function statusBadge(status) {
  return { Pending: 'badge-pending', Approved: 'badge-approved', Rejected: 'badge-rejected' }[status]
}

function statusDot(status) {
  return { Pending: 'bg-amber-500', Approved: 'bg-emerald-500', Rejected: 'bg-red-500' }[status]
}

onMounted(() => leaveStore.fetchMyLeaves())
</script>
