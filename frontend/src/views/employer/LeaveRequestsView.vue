<template>
  <div class="animate-slide-up">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold text-gray-900">Leave Requests</h1>
      <p class="text-gray-500 mt-1">Review and manage employee leave applications.</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <!-- Status filter -->
      <div class="flex gap-1.5 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-card">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="filters.status = tab.value"
          class="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="filters.status === tab.value
            ? 'bg-brand-600 text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-900'"
        >
          {{ tab.label }}
          <span class="ml-1 text-xs opacity-70">({{ countByStatus(tab.value) }})</span>
        </button>
      </div>

      <!-- Leave type filter -->
      <select v-model="filters.leaveType" class="input w-auto text-sm py-2 rounded-xl">
        <option value="">All Types</option>
        <option v-for="t in leaveTypes" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="leaveStore.loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredLeaves.length === 0" class="card text-center py-16">
      <div class="text-5xl mb-3">📭</div>
      <p class="text-gray-500">No leave requests match your filters.</p>
    </div>

    <!-- Table / Cards -->
    <div v-else class="space-y-3">
      <div
        v-for="leave in filteredLeaves"
        :key="leave._id"
        class="card hover:shadow-card-hover transition-all duration-200 animate-fade-in"
      >
        <div class="flex items-start justify-between gap-4">
          <!-- Employee info -->
          <div class="flex items-start gap-4 flex-1 min-w-0">
            <div class="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
              <span class="font-bold text-brand-700">{{ leave.employee?.name?.charAt(0) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center flex-wrap gap-2 mb-1">
                <h3 class="font-display font-semibold text-gray-900">{{ leave.employee?.name }}</h3>
                <span class="text-gray-300">·</span>
                <span class="text-sm text-gray-500">{{ leave.employee?.department || 'N/A' }}</span>
                <span :class="statusBadge(leave.status)">
                  <span class="w-1.5 h-1.5 rounded-full inline-block" :class="statusDot(leave.status)"></span>
                  {{ leave.status }}
                </span>
              </div>
              <p class="text-xs text-gray-400 mb-2">{{ leave.employee?.email }}</p>

              <div class="flex flex-wrap gap-3 text-sm text-gray-600">
                <span class="flex items-center gap-1.5">
                  <span class="text-base">{{ leaveTypeIcon(leave.leaveType) }}</span>
                  {{ leave.leaveType }} Leave
                </span>
                <span class="text-gray-300">·</span>
                <span>{{ formatDate(leave.startDate) }} – {{ formatDate(leave.endDate) }}</span>
                <span class="text-gray-300">·</span>
                <span class="font-medium text-brand-600">{{ leave.totalDays }} day{{ leave.totalDays !== 1 ? 's' : '' }}</span>
              </div>

              <p class="text-sm text-gray-500 mt-2 leading-relaxed">{{ leave.reason }}</p>

              <!-- Review info -->
              <div v-if="leave.reviewNote" class="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2">
                <svg class="w-3.5 h-3.5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <p class="text-xs text-gray-500"><span class="font-medium">Note:</span> {{ leave.reviewNote }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col items-end gap-2 flex-shrink-0">
            <p class="text-xs text-gray-400">{{ formatDate(leave.createdAt) }}</p>
            <div v-if="leave.status === 'Pending'" class="flex gap-2">
              <button
                @click="openReviewModal(leave, 'Rejected')"
                class="btn-danger py-1.5 px-3 text-xs rounded-lg"
              >
                Reject
              </button>
              <button
                @click="openReviewModal(leave, 'Approved')"
                class="btn-success py-1.5 px-3 text-xs rounded-lg"
              >
                Approve
              </button>
            </div>
            <span v-else class="text-xs text-gray-400">
              Reviewed {{ leave.reviewedAt ? formatDate(leave.reviewedAt) : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <Teleport to="body">
      <div
        v-if="modal.show"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-3xl shadow-modal w-full max-w-md animate-scale-in">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                :class="modal.action === 'Approved' ? 'bg-emerald-100' : 'bg-red-100'"
              >
                {{ modal.action === 'Approved' ? '✅' : '❌' }}
              </div>
              <div>
                <h3 class="font-display font-bold text-gray-900 text-lg">
                  {{ modal.action === 'Approved' ? 'Approve' : 'Reject' }} Leave Request
                </h3>
                <p class="text-sm text-gray-500">{{ modal.leave?.employee?.name }}</p>
              </div>
            </div>

            <div class="bg-surface-50 rounded-xl p-3 mb-4 text-sm text-gray-600 space-y-1">
              <p><span class="font-medium">Type:</span> {{ modal.leave?.leaveType }} Leave</p>
              <p><span class="font-medium">Duration:</span> {{ formatDate(modal.leave?.startDate) }} – {{ formatDate(modal.leave?.endDate) }} ({{ modal.leave?.totalDays }} days)</p>
            </div>

            <div class="form-group mb-4">
              <label class="label">Note <span class="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                v-model="modal.note"
                rows="3"
                :placeholder="`Add a note for the ${modal.action === 'Approved' ? 'approval' : 'rejection'}…`"
                class="input resize-none"
              ></textarea>
            </div>

            <!-- Error -->
            <div v-if="modal.error" class="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p class="text-red-700 text-sm">{{ modal.error }}</p>
            </div>

            <div class="flex gap-3">
              <button @click="closeModal" class="btn-secondary flex-1">Cancel</button>
              <button
                @click="submitReview"
                :disabled="leaveStore.loading"
                class="flex-1"
                :class="modal.action === 'Approved' ? 'btn-success' : 'btn-danger'"
              >
                <svg v-if="leaveStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ leaveStore.loading ? 'Processing…' : modal.action === 'Approved' ? 'Approve' : 'Reject' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useLeaveStore } from '@/store/leave'

const leaveStore = useLeaveStore()

const filters = ref({ status: 'All', leaveType: '' })

const statusTabs = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' }
]

const leaveTypes = ['Annual', 'Sick', 'Maternity', 'Paternity', 'Unpaid', 'Emergency', 'Other']

const filteredLeaves = computed(() => {
  let result = leaveStore.leaves
  if (filters.value.status !== 'All') result = result.filter(l => l.status === filters.value.status)
  if (filters.value.leaveType) result = result.filter(l => l.leaveType === filters.value.leaveType)
  return result
})

function countByStatus(status) {
  if (status === 'All') return leaveStore.leaves.length
  return leaveStore.leaves.filter(l => l.status === status).length
}

// Modal state
const modal = ref({ show: false, leave: null, action: '', note: '', error: '' })

function openReviewModal(leave, action) {
  modal.value = { show: true, leave, action, note: '', error: '' }
}

function closeModal() {
  modal.value.show = false
}

async function submitReview() {
  modal.value.error = ''
  try {
    await leaveStore.reviewLeave(modal.value.leave._id, {
      status: modal.value.action,
      reviewNote: modal.value.note
    })
    await leaveStore.fetchStats()
    closeModal()
  } catch (err) {
    modal.value.error = err
  }
}

function formatDate(d) {
  if (!d) return ''
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

onMounted(() => leaveStore.fetchAllLeaves())
</script>
