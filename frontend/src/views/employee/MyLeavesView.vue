<template>
  <div class="animate-slide-up">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-gray-900">My Leaves</h1>
        <p class="text-gray-500 mt-1">Track all your leave applications and their status.</p>
      </div>
      <router-link to="/employee/apply" class="btn-primary">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Request
      </router-link>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 mb-6 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-card w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        :class="activeTab === tab.value
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-gray-500 hover:text-gray-900'"
      >
        {{ tab.label }}
        <span class="ml-1.5 text-xs" :class="activeTab === tab.value ? 'opacity-75' : 'opacity-60'">
          ({{ tabCount(tab.value) }})
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="leaveStore.loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredLeaves.length === 0" class="card text-center py-16">
      <div class="text-5xl mb-3">📭</div>
      <p class="text-gray-500">No {{ activeTab !== 'All' ? activeTab.toLowerCase() : '' }} leave applications found.</p>
      <router-link to="/employee/apply" class="btn-primary mt-4 inline-flex">Apply for leave</router-link>
    </div>

    <!-- Leave cards -->
    <div v-else class="space-y-3">
      <div
        v-for="leave in filteredLeaves"
        :key="leave._id"
        class="card hover:shadow-card-hover transition-all duration-200 animate-fade-in"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-surface-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
              {{ leaveTypeIcon(leave.leaveType) }}
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-display font-semibold text-gray-900">{{ leave.leaveType }} Leave</h3>
                <span :class="statusBadge(leave.status)">
                  <span class="w-1.5 h-1.5 rounded-full inline-block" :class="statusDot(leave.status)"></span>
                  {{ leave.status }}
                </span>
              </div>
              <p class="text-sm text-gray-500">
                {{ formatDate(leave.startDate) }} – {{ formatDate(leave.endDate) }}
                <span class="mx-1.5 text-gray-300">·</span>
                <span class="font-medium text-gray-600">{{ leave.totalDays }} day{{ leave.totalDays !== 1 ? 's' : '' }}</span>
              </p>
              <p class="text-sm text-gray-500 mt-2 leading-relaxed max-w-xl">{{ leave.reason }}</p>
            </div>
          </div>
          <div class="flex-shrink-0 text-right">
            <p class="text-xs text-gray-400">Applied</p>
            <p class="text-xs text-gray-500 font-medium">{{ formatDate(leave.createdAt) }}</p>
          </div>
        </div>

        <!-- Review note -->
        <div v-if="leave.reviewNote" class="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2">
          <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Reviewer note from {{ leave.reviewedBy?.name }}</p>
            <p class="text-sm text-gray-600">{{ leave.reviewNote }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLeaveStore } from '@/store/leave'

const leaveStore = useLeaveStore()
const activeTab = ref('All')

const tabs = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' }
]

const filteredLeaves = computed(() => {
  if (activeTab.value === 'All') return leaveStore.leaves
  return leaveStore.leaves.filter(l => l.status === activeTab.value)
})

function tabCount(tab) {
  if (tab === 'All') return leaveStore.leaves.length
  return leaveStore.leaves.filter(l => l.status === tab).length
}

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
