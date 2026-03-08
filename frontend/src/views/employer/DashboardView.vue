<template>
  <div class="animate-slide-up">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-500 mt-1">Overview of all leave requests in your organisation.</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in statsCards" :key="stat.label" class="stat-card flex-col items-start">
        <div class="flex items-center justify-between w-full mb-2">
          <span class="text-2xl">{{ stat.icon }}</span>
          <span class="text-2xl font-display font-bold" :class="stat.color">{{ stat.value }}</span>
        </div>
        <p class="text-sm text-gray-500">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Recent pending requests -->
    <div class="card">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-display font-bold text-gray-900">Pending Requests</h2>
        <router-link to="/employer/requests" class="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors">
          View all →
        </router-link>
      </div>

      <div v-if="leaveStore.loading" class="flex justify-center py-10">
        <div class="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="pendingLeaves.length === 0" class="text-center py-10">
        <div class="text-4xl mb-3">✅</div>
        <p class="text-gray-500 text-sm">No pending requests. All caught up!</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="leave in pendingLeaves"
          :key="leave._id"
          class="flex items-center justify-between p-4 rounded-xl bg-surface-50 border border-amber-100 hover:border-amber-200 transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-amber-700">{{ leave.employee?.name?.charAt(0) }}</span>
            </div>
            <div>
              <p class="font-medium text-gray-900 text-sm">{{ leave.employee?.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ leave.leaveType }} · {{ leave.totalDays }} day{{ leave.totalDays !== 1 ? 's' : '' }} · {{ formatDate(leave.startDate) }}
              </p>
            </div>
          </div>
          <span class="badge-pending">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLeaveStore } from '@/store/leave'

const leaveStore = useLeaveStore()

const pendingLeaves = computed(() => leaveStore.leaves.filter(l => l.status === 'Pending').slice(0, 5))

const statsCards = computed(() => [
  { label: 'Total Requests', value: leaveStore.stats.total, icon: '📋', color: 'text-brand-600' },
  { label: 'Pending Review', value: leaveStore.stats.pending, icon: '⏳', color: 'text-amber-600' },
  { label: 'Approved', value: leaveStore.stats.approved, icon: '✅', color: 'text-emerald-600' },
  { label: 'Rejected', value: leaveStore.stats.rejected, icon: '❌', color: 'text-red-600' }
])

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

onMounted(async () => {
  await Promise.all([leaveStore.fetchAllLeaves(), leaveStore.fetchStats()])
})
</script>
