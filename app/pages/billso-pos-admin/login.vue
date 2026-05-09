<script setup lang="ts">
import { ref } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { signInAnonymously } from 'firebase/auth'

definePageMeta({ layout: false })

const { $auth, $db } = useNuxtApp()
const router = useRouter()

const email = ref('')
const password = ref('')
const pin = ref('')
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value || !pin.value) {
    errorMsg.value = 'Please fill in Email, Password, and PIN'
    return
  }
  loading.value = true
  errorMsg.value = ''

  try {
    // 1. Sign in anonymously to gain Firestore access
    await signInAnonymously($auth)
    
    const path = 'admin_access/current'
    const adminDoc = await getDoc(doc($db, 'admin_access', 'current'))

    if (adminDoc.exists()) {
      const data = adminDoc.data()
      console.log('Admin document found. Verifying...')
      
      // Triple-Check the credentials
      if (
        data.email === email.value && 
        data.password === password.value && 
        data.pin === pin.value
      ) {
        localStorage.setItem('billso_admin_session', 'active')
        console.log('Admin verification successful! Redirecting...')
        router.push('/billso-pos-admin')
      } else {
        errorMsg.value = 'Invalid Admin credentials or PIN. Access Denied.'
      }
    } else {
      console.warn(`Firestore check failed: Nothing found at path "${path}"`)
      errorMsg.value = `Error: Document "${path}" was NOT found in your Firestore Database. Please check your spelling!`
    }

  } catch (e: any) {
    console.error('Login error:', e)
    errorMsg.value = `Access Denied: ${e.code || e.message}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl p-10">
      
      <!-- Logo & Heading -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-2xl mx-auto grid place-items-center text-white text-2xl font-black mb-4">B</div>
        <h1 class="text-2xl font-extrabold text-slate-900">Secure Admin Portal</h1>
        <p class="text-slate-500 text-sm mt-1">Enter your master credentials to enter the panel</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Admin Email</label>
          <input v-model="email" type="email" placeholder="admin@billso.com" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition" />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Master Password</label>
          <input v-model="password" type="password" placeholder="••••••••" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition" />
        </div>

        <!-- PIN -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Secret PIN</label>
          <input v-model="pin" type="password" placeholder="4-6 Digit PIN" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition" />
        </div>

        <!-- Error -->
        <div v-if="errorMsg" class="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-xs flex gap-2 items-center">
          <span>⚠️</span> {{ errorMsg }}
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="loading" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2">
           <svg v-if="loading" class="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
           <span>{{ loading ? 'Verifying Access...' : 'Authenticate & Enter' }}</span>
        </button>
      </form>

      <p class="mt-8 text-center text-xs text-slate-400">🚨 Restricted System. Authorized access only.</p>
    </div>
  </div>
</template>
