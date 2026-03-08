import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useLeaveStore = defineStore('leave', () => {
  const leaves = ref([])
  const stats = ref({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const loading = ref(false)
  const error = ref(null)

  async function applyLeave(payload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/leaves', payload)
      leaves.value.unshift(data.leave)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to apply for leave'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function fetchMyLeaves() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/leaves/my')
      leaves.value = data.leaves
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch leaves'
    } finally {
      loading.value = false
    }
  }

  async function fetchAllLeaves(filters = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/leaves', { params: filters })
      leaves.value = data.leaves
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch leaves'
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const { data } = await api.get('/leaves/stats')
      stats.value = data.stats
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  async function reviewLeave(id, payload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.patch(`/leaves/${id}/review`, payload)
      const index = leaves.value.findIndex((l) => l._id === id)
      if (index !== -1) leaves.value[index] = data.leave
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to review leave'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return { leaves, stats, loading, error, applyLeave, fetchMyLeaves, fetchAllLeaves, fetchStats, reviewLeave }
})
