<template>
  <div class="animate-slide-up max-w-2xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold text-gray-900">Apply for Leave</h1>
      <p class="text-gray-500 mt-1">Fill in the details below to submit your leave request.</p>
    </div>

    <!-- Success state -->
    <div v-if="submitted" class="card text-center py-12 animate-scale-in">
      <div class="text-5xl mb-4">🎉</div>
      <h2 class="text-2xl font-display font-bold text-gray-900 mb-2">Request Submitted!</h2>
      <p class="text-gray-500 mb-6">Your leave application has been sent to your employer for review.</p>
      <div class="flex gap-3 justify-center">
        <button @click="resetForm" class="btn-secondary">Apply again</button>
        <router-link to="/employee/my-leaves" class="btn-primary">View my leaves</router-link>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="card">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Leave type -->
        <div class="form-group">
          <label class="label">Leave Type</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="type in leaveTypes"
              :key="type.value"
              type="button"
              @click="form.leaveType = type.value"
              class="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all duration-200 text-xs font-medium"
              :class="form.leaveType === type.value
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'"
            >
              <span class="text-xl">{{ type.icon }}</span>
              <span>{{ type.value }}</span>
            </button>
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="label">Start Date</label>
            <input v-model="form.startDate" type="date" class="input" :min="today" required />
          </div>
          <div class="form-group">
            <label class="label">End Date</label>
            <input v-model="form.endDate" type="date" class="input" :min="form.startDate || today" required />
          </div>
        </div>

        <!-- Duration preview -->
        <div v-if="duration > 0" class="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm text-brand-700 font-medium">
            {{ duration }} day{{ duration !== 1 ? 's' : '' }} of leave requested
          </span>
        </div>

        <!-- Reason -->
        <div class="form-group">
          <label class="label">Reason</label>
          <textarea
            v-model="form.reason"
            rows="4"
            placeholder="Please describe the reason for your leave request (minimum 10 characters)…"
            class="input resize-none"
            minlength="10"
            maxlength="500"
            required
          ></textarea>
          <p class="text-xs text-gray-400 mt-1 text-right">{{ form.reason.length }}/500</p>
        </div>

        <!-- Error -->
        <div v-if="errorMsg" class="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 text-sm">{{ errorMsg }}</p>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" @click="resetForm" class="btn-secondary flex-1">Clear</button>
          <button type="submit" :disabled="leaveStore.loading" class="btn-primary flex-1">
            <svg v-if="leaveStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ leaveStore.loading ? 'Submitting…' : 'Submit Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLeaveStore } from '@/store/leave'

const leaveStore = useLeaveStore()

const today = new Date().toISOString().split('T')[0]
const submitted = ref(false)
const errorMsg = ref('')

const leaveTypes = [
  { value: 'Annual', icon: '🏖️' },
  { value: 'Sick', icon: '🤒' },
  { value: 'Emergency', icon: '🚨' },
  { value: 'Maternity', icon: '🤱' },
  { value: 'Paternity', icon: '👨‍👶' },
  { value: 'Unpaid', icon: '💸' },
  { value: 'Other', icon: '📄' }
]

const defaultForm = () => ({
  leaveType: 'Annual',
  startDate: '',
  endDate: '',
  reason: ''
})

const form = ref(defaultForm())

const duration = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return 0
  const start = new Date(form.value.startDate)
  const end = new Date(form.value.endDate)
  if (end < start) return 0
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
})

function resetForm() {
  form.value = defaultForm()
  submitted.value = false
  errorMsg.value = ''
}

async function handleSubmit() {
  errorMsg.value = ''
  if (duration.value <= 0) {
    errorMsg.value = 'End date must be after start date.'
    return
  }
  try {
    await leaveStore.applyLeave(form.value)
    submitted.value = true
  } catch (err) {
    errorMsg.value = err
  }
}
</script>
