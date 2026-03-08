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
        <h2 class="text-2xl font-display font-bold text-gray-900 mb-1">Welcome back</h2>
        <p class="text-gray-500 text-sm mb-6">Sign in to your account to continue</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-group">
            <label class="label">Email address</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@company.com"
              class="input"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label class="label">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input pr-10"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-700 text-sm">{{ errorMsg }}</p>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary btn-lg w-full mt-2"
          >
            <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ authStore.loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <router-link to="/register" class="text-brand-600 font-medium hover:text-brand-700 transition-colors">
            Create one
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

const form = ref({ email: '', password: '' })
const showPassword = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  try {
    await authStore.login(form.value)
    const redirect = authStore.isEmployee ? '/employee/dashboard' : '/employer/dashboard'
    router.push(redirect)
  } catch (err) {
    errorMsg.value = err
  }
}
</script>
