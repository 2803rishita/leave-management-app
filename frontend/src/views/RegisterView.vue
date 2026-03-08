<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 flex items-center justify-center p-4">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-brand-700 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-500 rounded-full opacity-20 blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md animate-slide-up">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm border border-white/20">
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-3xl font-display font-bold text-white tracking-tight">LeaveFlow</h1>
        <p class="text-brand-200 mt-1 text-sm">Leave Management System</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-3xl shadow-modal p-8">
        <h2 class="text-2xl font-display font-bold text-gray-900 mb-1">Create account</h2>
        <p class="text-gray-500 text-sm mb-6">Fill in your details to get started</p>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="form-group">
            <label class="label">Full name</label>
            <input v-model="form.name" type="text" placeholder="John Doe" class="input" required />
          </div>

          <div class="form-group">
            <label class="label">Email address</label>
            <input v-model="form.email" type="email" placeholder="you@company.com" class="input" required />
          </div>

          <div class="form-group">
            <label class="label">Department <span class="text-gray-400 font-normal">(optional)</span></label>
            <input v-model="form.department" type="text" placeholder="e.g. Engineering, Marketing" class="input" />
          </div>

          <div class="form-group">
            <label class="label">I am a</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="r in roles"
                :key="r.value"
                type="button"
                @click="form.role = r.value"
                class="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium"
                :class="form.role === r.value
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'"
              >
                <span class="text-lg">{{ r.icon }}</span>
                <span>{{ r.label }}</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="label">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="At least 6 characters"
              class="input"
              required
              minlength="6"
            />
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-700 text-sm">{{ errorMsg }}</p>
          </div>

          <button type="submit" :disabled="authStore.loading" class="btn-primary btn-lg w-full mt-2">
            <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ authStore.loading ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <router-link to="/login" class="text-brand-600 font-medium hover:text-brand-700 transition-colors">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ name: '', email: '', password: '', role: 'employee', department: '' })
const errorMsg = ref('')

const roles = [
  { value: 'employee', label: 'Employee', icon: '👤' },
  { value: 'employer', label: 'Employer', icon: '🏢' }
]

async function handleRegister() {
  errorMsg.value = ''
  try {
    await authStore.register(form.value)
    const redirect = authStore.isEmployee ? '/employee/dashboard' : '/employer/dashboard'
    router.push(redirect)
  } catch (err) {
    errorMsg.value = err
  }
}
</script>
