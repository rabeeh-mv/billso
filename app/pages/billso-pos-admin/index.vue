<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, doc, updateDoc, onSnapshot, orderBy, query, deleteDoc, getDoc, addDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth'

definePageMeta({ layout: false })

const { $auth, $db } = useNuxtApp()
const router = useRouter()

const ICONS = {
  dashboard: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
  users: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
  payments: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
  plans: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>',
  notifications: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
  revenue: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  clock: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  check: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  zap: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
  settings: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  sun: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
}

// ── State ─────────────────────────────────────────────────────
const ready = ref(false)
const authenticated = ref(false)
const authUser = ref<any>(null)
const activeTab = ref<'dashboard' | 'users' | 'payments' | 'plans' | 'notifications'>('dashboard')

const users = ref<any[]>([])
const payments = ref<any[]>([])
const plans = ref<any[]>([])
const subSettings = ref({ 
  default_plan_id: '', 
  temporary_plan_id: '', 
  notification_enabled: false, 
  notification_text: 'Welcome to Billso POS!' 
})
const shopMap = ref<Record<string, string>>({})  // uid or business_id → shop_name

const userSearch = ref('')
const payFilter = ref<'all' | 'pending' | 'approved' | 'rejected'>('all')

const toast = ref<{ msg: string; ok: boolean } | null>(null)

const userToDelete = ref<any>(null)
const deletePin = ref('')

const mobileMenuOpen = ref(false)

const planForm = ref({ id: '', name: '', duration: 30, notes: '', price: 0, show_in_app: true, upi_id: '' })
const editingPlan = ref(false)
const showPlanModal = ref(false)

let unsubUsers: (() => void) | null = null
let unsubPayments: (() => void) | null = null
let unsubPlans: (() => void) | null = null
let unsubSettings: (() => void) | null = null

// ── Computed ──────────────────────────────────────────────────
const filteredUsers = computed(() => {
  if (!userSearch.value.trim()) return users.value
  const s = userSearch.value.toLowerCase()
  return users.value.filter(u =>
    (u.shop_name ?? '').toLowerCase().includes(s) ||
    (u.shop_type ?? '').toLowerCase().includes(s) ||
    (u.business_id ?? '').toLowerCase().includes(s) ||
    (u.phone ?? '').includes(s) ||
    (u.email ?? '').toLowerCase().includes(s)
  )
})

const filteredPayments = computed(() =>
  payFilter.value === 'all' ? payments.value : payments.value.filter(p => p.status === payFilter.value)
)

const pendingCount = computed(() => payments.value.filter(p => p.status === 'pending').length)
const approvedCount = computed(() => payments.value.filter(p => p.status === 'approved').length)
const totalRevenue = computed(() =>
  payments.value
    .filter(p => p.status === 'approved')
    .reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0)
)
const paidUsers = computed(() => users.value.filter(u => u.subscription?.plan && u.subscription.plan !== 'trial').length)

// ── Auth ──────────────────────────────────────────────────────
onMounted(() => {
  console.log('--- DASHBOARD MOUNTED ---')
  
  // 1. Check local session flag first
  const session = localStorage.getItem('billso_admin_session')
  if (session !== 'active') {
    console.log('No admin session. Kicking to login.')
    router.push('/billso-pos-admin/login')
    return
  }

  // 2. Ensure we have Firestore access via Anonymous Auth
  onAuthStateChanged($auth, async (user) => {
    if (!user) {
      await signInAnonymously($auth)
    }
    
    authUser.value = user
    authenticated.value = true
    startListeners()
    ready.value = true
    console.log('Admin verification successful!')
  })
})

onUnmounted(() => {
  unsubUsers?.()
  unsubPayments?.()
  unsubPlans?.()
  unsubSettings?.()
})

// ── Listeners ─────────────────────────────────────────────────
const startListeners = () => {
  // Users
  unsubUsers = onSnapshot(
    query(collection($db, 'users'), orderBy('shop_name')),
    snap => {
      const list: any[] = []
      const map: Record<string, string> = {}
      snap.forEach(d => {
        const data = { id: d.id, ...d.data() }
        list.push(data)
        map[d.id] = data.shop_name || 'Unknown'
        if (data.business_id) map[data.business_id] = data.shop_name || 'Unknown'
      })
      users.value = list
      shopMap.value = map
    }
  )

  // Payments
  unsubPayments = onSnapshot(
    query(collection($db, 'payment_requests'), orderBy('created_at', 'desc')),
    snap => {
      payments.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }
  )

  // Plans
  unsubPlans = onSnapshot(
    query(collection($db, 'plans'), orderBy('price')),
    snap => {
      plans.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }
  )

  // Settings
  unsubSettings = onSnapshot(doc($db, 'settings', 'subscription'), d => {
    if (d.exists()) {
      subSettings.value = { ...subSettings.value, ...d.data() }
    }
  })
}

// ── Actions ───────────────────────────────────────────────────
const showToast = (msg: string, ok = true) => {
  toast.value = { msg, ok }
  setTimeout(() => toast.value = null, 3500)
}

const approvePayment = async (req: any) => {
  try {
    const days: Record<string, number> = { monthly: 30, '6month': 180, '6-month': 180, yearly: 365 }
    // Try to find the plan in our dynamic plans list first
    const selectedPlan = plans.value.find(p => p.id === req.plan || p.name.toLowerCase() === req.plan.toLowerCase())
    const n = selectedPlan ? selectedPlan.duration : (days[req.plan] ?? 30)
    
    const expiry = new Date(); expiry.setDate(expiry.getDate() + n)

    await updateDoc(doc($db, 'payment_requests', req.id), {
      status: 'approved', approved_at: new Date().toISOString()
    })
    if (req.user_id) {
      await updateDoc(doc($db, 'users', req.user_id), {
        'subscription.plan': selectedPlan ? selectedPlan.name : req.plan,
        'subscription.expiry_date': expiry.toISOString(),
        'subscription.active': true,
        'subscription.paid_amount': req.amount
      })
    }
    showToast(`✓ Approved! Subscription extended ${n} days.`)
  } catch (e: any) {
    showToast('❌ Approve failed: ' + e.message, false)
  }
}

const rejectPayment = async (req: any) => {
  if (!confirm(`Reject ₹${req.amount} from ${shopName(req)}?`)) return
  try {
    await updateDoc(doc($db, 'payment_requests', req.id), {
      status: 'rejected', rejected_at: new Date().toISOString()
    })
    showToast('Payment rejected.')
  } catch (e: any) {
    showToast('❌ Reject failed: ' + e.message, false)
  }
}

const editingUser = ref<any>(null)
const subForm = ref({ plan: 'trial', expiry: '', active: true, paidAmount: 0 })

const openSubEditor = (u: any) => {
  editingUser.value = u
  subForm.value = {
    plan: u.subscription?.plan || 'trial',
    expiry: u.subscription?.expiry_date ? u.subscription.expiry_date.split('T')[0] : new Date().toISOString().split('T')[0],
    active: u.subscription?.active ?? false,
    paidAmount: u.subscription?.paid_amount ?? 0
  }
}

const saveSubscription = async () => {
  if (!editingUser.value) return
  try {
    const d = new Date(subForm.value.expiry)
    await updateDoc(doc($db, 'users', editingUser.value.id), {
      'subscription.plan': subForm.value.plan,
      'subscription.expiry_date': d.toISOString(),
      'subscription.active': subForm.value.active,
      'subscription.paid_amount': subForm.value.paidAmount
    })
    showToast('✓ Subscription updated successfully!')
    editingUser.value = null
  } catch (e: any) {
    showToast('❌ Update failed: ' + e.message, false)
  }
}

const confirmDelete = async () => {
  if (!userToDelete.value || !deletePin.value) return
  try {
    // 1. Fetch official PIN from admin doc
    const adminDoc = await getDoc(doc($db, 'admin_access', 'current'))
    if (adminDoc.exists()) {
       const correctPin = adminDoc.data().pin
       if (deletePin.value === correctPin) {
          // PIN is correct! Delete the user
          await deleteDoc(doc($db, 'users', userToDelete.value.id))
          showToast('🗑️ User deleted permanently.')
          userToDelete.value = null
          deletePin.value = ''
       } else {
          showToast('❌ Incorrect PIN. Security lockout avoided.', false)
          deletePin.value = ''
       }
    }
  } catch (e: any) {
     showToast('Error: ' + e.message, false)
  }
}

const handleLogout = async () => { 
  localStorage.removeItem('billso_admin_session')
  await signOut($auth)
  router.push('/billso-pos-admin/login') 
}

// ── Plan Actions ──────────────────────────────────────────────
const openPlanModal = (plan?: any) => {
  if (plan) {
    planForm.value = { ...plan }
    editingPlan.value = true
  } else {
    planForm.value = { id: '', name: '', duration: 30, notes: '', price: 0, show_in_app: true, upi_id: '' }
    editingPlan.value = false
  }
  showPlanModal.value = true
}

const savePlan = async () => {
  try {
    const data = { ...planForm.value }
    const id = data.id
    delete (data as any).id
    
    if (editingPlan.value) {
      await updateDoc(doc($db, 'plans', id), data)
    } else {
      await addDoc(collection($db, 'plans'), data)
    }
    showToast(`✓ Plan ${editingPlan.value ? 'updated' : 'added'}!`)
    showPlanModal.value = false
  } catch (e: any) {
    showToast('❌ Save failed: ' + e.message, false)
  }
}

const deletePlan = async (id: string) => {
  if (!confirm('Are you sure you want to delete this plan?')) return
  try {
    await deleteDoc(doc($db, 'plans', id))
    showToast('Plan deleted.')
  } catch (e: any) {
    showToast('❌ Delete failed: ' + e.message, false)
  }
}

const saveSubSettings = async () => {
  try {
    await setDoc(doc($db, 'settings', 'subscription'), subSettings.value, { merge: true })
    showToast('✓ Subscription settings saved!')
  } catch (e: any) {
    showToast('❌ Save failed: ' + e.message, false)
  }
}

// ── Helpers ───────────────────────────────────────────────────
const shopName = (req: any) =>
  shopMap.value[req.user_id] || shopMap.value[req.business_id] || req.business_id || '—'

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const planBadge = (plan?: string) => ({
  trial: 'bg-amber-100 text-amber-800',
  monthly: 'bg-blue-100 text-blue-800',
  '6month': 'bg-purple-100 text-purple-800',
  '6-month': 'bg-purple-100 text-purple-800',
  yearly: 'bg-green-100 text-green-800',
})[plan ?? ''] ?? 'bg-slate-100 text-slate-600'

const statusBadge = (status?: string) => ({
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
})[status ?? ''] ?? 'bg-slate-100 text-slate-600'
</script>

<template>
  <!-- ── Loading splash ── -->
  <div v-if="!ready" class="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5 font-sans">
    <div class="w-12 h-12 bg-blue-600 rounded-2xl grid place-items-center text-white text-xl font-black">B</div>
    <svg class="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
    <p class="text-slate-400 text-sm">Loading secure admin panel...</p>
  </div>

  <!-- ── Main Layout ── -->
  <div v-else-if="authenticated" class="flex min-h-screen font-sans bg-slate-100 text-slate-900">

    <!-- ═══ SIDEBAR ═══ -->
    <!-- Overlay for mobile -->
    <div 
      v-if="mobileMenuOpen" 
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden"
      @click="mobileMenuOpen = false"
    ></div>

    <aside 
      :class="[
        'fixed inset-y-0 left-0 w-72 bg-slate-900 flex flex-col z-[50] transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:shrink-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-5 py-6 border-b border-slate-800">
        <div class="w-9 h-9 bg-blue-600 rounded-xl grid place-items-center text-white font-black text-sm shrink-0">B</div>
        <div>
          <div class="text-white font-bold text-sm">Billso POS</div>
          <div class="text-slate-500 text-xs">Admin Panel</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-3 space-y-1">
        <button
          v-for="item in [
            { key: 'dashboard', icon: ICONS.dashboard, label: 'Dashboard' },
            { key: 'users',     icon: ICONS.users,     label: 'Users',    count: users.length },
            { key: 'payments',  icon: ICONS.payments,  label: 'Payments', count: pendingCount, danger: true },
            { key: 'plans',     icon: ICONS.plans,     label: 'Plans' },
            { key: 'notifications', icon: ICONS.notifications, label: 'Notifications' },
          ]"
          :key="item.key"
          @click="() => { activeTab = item.key as any; mobileMenuOpen = false }"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
            activeTab === item.key
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <span class="text-base" v-html="item.icon"></span>
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="item.count !== undefined && item.count > 0"
            :class="[
              'text-xs px-2 py-0.5 rounded-full font-bold',
              item.danger && item.count > 0 ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
            ]"
          >{{ item.count }}</span>
        </button>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-800">
        <p class="text-slate-500 text-xs text-center truncate mb-3">{{ authUser?.email }}</p>
        <button
          @click="handleLogout"
          class="w-full py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition"
        >Sign Out</button>
      </div>
    </aside>

    <!-- ═══ MAIN ═══ -->
    <main class="flex-1 overflow-auto">
      <header class="sticky top-0 z-[30] bg-white border-b border-slate-200 px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Hamburger for mobile -->
          <button 
            @click="mobileMenuOpen = true" 
            class="p-2 -ml-2 text-slate-600 lg:hidden hover:bg-slate-50 rounded-lg transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          
          <div>
            <h1 class="text-lg lg:text-xl font-extrabold text-slate-900">
              {{ { dashboard: 'Dashboard', users: 'Users', payments: 'Payments', plans: 'Subscription Plans', notifications: 'App Notifications' }[activeTab] }}
            </h1>
            <p class="text-slate-400 text-[10px] lg:text-xs mt-0.5">Billso Admin · Live</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2">
            <span class="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span class="text-xs text-emerald-600 font-semibold uppercase tracking-tight">System Live</span>
          </div>
          <div class="w-8 h-8 lg:w-9 lg:h-9 bg-slate-100 rounded-xl grid place-items-center text-slate-500 font-bold text-sm border border-slate-200">
            {{ (authUser?.email || 'A').charAt(0).toUpperCase() }}
          </div>
        </div>
      </header>

      <div class="p-4 lg:p-8">

        <!-- ─────────── DASHBOARD ─────────────────────────── -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <!-- Stat cards -->
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-5">
            <div v-for="s in [
              { label: 'Total Revenue', value: '₹' + totalRevenue.toLocaleString('en-IN'), icon: ICONS.revenue, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Total Users', value: users.length, icon: ICONS.users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Pending Approvals', value: pendingCount, icon: ICONS.clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Approved Payments', value: approvedCount, icon: ICONS.check, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Paid Subscribers', value: paidUsers, icon: ICONS.zap, color: 'text-purple-600', bg: 'bg-purple-50' },
            ]" :key="s.label"
              class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div class="flex items-center gap-3 mb-4">
                <div :class="['w-9 h-9 rounded-xl grid place-items-center text-lg', s.bg]" v-html="s.icon"></div>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">{{ s.label }}</span>
              </div>
              <p :class="['text-2xl font-black', s.color]">{{ s.value }}</p>
            </div>
          </div>

          <!-- Pending payments quick view -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 class="font-bold text-slate-800 flex items-center gap-2">
                <span v-html="ICONS.clock" class="text-amber-500"></span>
                Pending Approvals
              </h2>
              <button @click="activeTab = 'payments'" class="text-xs text-blue-600 font-semibold hover:underline">View all →</button>
            </div>
            <div v-if="pendingCount === 0" class="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <span class="text-4xl">🎉</span>
              <p class="text-sm">No pending payments — all clear!</p>
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th class="px-6 py-3 text-left font-semibold">Shop</th>
                    <th class="px-6 py-3 text-left font-semibold hidden sm:table-cell">Plan</th>
                    <th class="px-6 py-3 text-left font-semibold">Amount</th>
                    <th class="px-6 py-3 text-left font-semibold hidden md:table-cell">UTR</th>
                    <th class="px-6 py-3 text-left font-semibold hidden lg:table-cell">Date</th>
                    <th class="px-6 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="req in payments.filter(p => p.status === 'pending')" :key="req.id" class="hover:bg-slate-50 transition">
                    <td class="px-6 py-4 font-semibold text-slate-900">
                      <div class="truncate max-w-[120px] sm:max-w-none">{{ shopName(req) }}</div>
                      <div class="sm:hidden text-[10px] text-slate-400 font-normal">{{ req.plan }}</div>
                    </td>
                    <td class="px-6 py-4 hidden sm:table-cell"><span :class="['px-2.5 py-1 rounded-full text-xs font-bold capitalize', planBadge(req.plan)]">{{ req.plan }}</span></td>
                    <td class="px-6 py-4 font-bold text-slate-900">₹{{ req.amount }}</td>
                    <td class="px-6 py-4 hidden md:table-cell"><code class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono">{{ req.utr || '—' }}</code></td>
                    <td class="px-6 py-4 text-slate-400 hidden lg:table-cell">{{ fmtDate(req.created_at) }}</td>
                    <td class="px-6 py-4">
                      <div class="flex gap-1 sm:gap-2">
                        <button @click="approvePayment(req)" class="px-2 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs font-bold rounded-lg transition">✓</button>
                        <button @click="rejectPayment(req)" class="px-2 sm:px-3 py-1.5 border border-red-400 text-red-500 hover:bg-red-50 text-[10px] sm:text-xs font-bold rounded-lg transition">✕</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent users quick view -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 class="font-bold text-slate-800 flex items-center gap-2">
                <span v-html="ICONS.users" class="text-blue-500"></span>
                Recent Users
              </h2>
              <button @click="activeTab = 'users'" class="text-xs text-blue-600 font-semibold hover:underline">View all →</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th class="px-6 py-3 text-left font-semibold">Shop Name</th>
                    <th class="px-6 py-3 text-left font-semibold">Business ID</th>
                    <th class="px-6 py-3 text-left font-semibold">Plan</th>
                    <th class="px-6 py-3 text-left font-semibold">Expiry</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="u in users.slice(0, 5)" :key="u.id" class="hover:bg-slate-50 transition">
                    <td class="px-6 py-4 font-semibold text-slate-900">{{ u.shop_name || '—' }}</td>
                    <td class="px-6 py-4"><code class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono">{{ u.business_id || '—' }}</code></td>
                    <td class="px-6 py-4"><span :class="['px-2.5 py-1 rounded-full text-xs font-bold capitalize', planBadge(u.subscription?.plan)]">{{ u.subscription?.plan || '—' }}</span></td>
                    <td class="px-6 py-4 text-slate-400 text-xs">{{ fmtDate(u.subscription?.expiry_date) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ─────────── USERS ──────────────────────────────── -->
        <div v-if="activeTab === 'users'">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6 py-4 border-b border-slate-100">
              <h2 class="font-bold text-slate-800">All Users ({{ filteredUsers.length }})</h2>
              <div class="relative w-full sm:w-72">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  v-model="userSearch"
                  placeholder="Search..."
                  class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th class="px-6 py-3 text-left font-semibold">Shop Name</th>
                    <th class="px-6 py-3 text-left font-semibold hidden lg:table-cell">Type</th>
                    <th class="px-6 py-3 text-left font-semibold hidden md:table-cell">Phone</th>
                    <th class="px-6 py-3 text-left font-semibold hidden md:table-cell">Email</th>
                    <th class="px-6 py-3 text-left font-semibold text-xs hidden lg:table-cell">Business ID</th>
                    <th class="px-6 py-3 text-left font-semibold hidden sm:table-cell">Devices</th>
                    <th class="px-6 py-3 text-left font-semibold hidden xl:table-cell">Last Sync</th>
                    <th class="px-6 py-3 text-left font-semibold">Subscription</th>
                    <th class="px-6 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="filteredUsers.length === 0">
                    <td colspan="6" class="text-center py-16 text-slate-400 text-sm">No users found</td>
                  </tr>
                  <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-slate-50 transition border-l-4" :class="u.subscription?.active ? 'border-l-emerald-500' : 'border-l-slate-200'">
                    <td class="px-6 py-4">
                      <div class="font-bold text-slate-900">
                        {{ u.shop_name || '—' }}
                        <div class="md:hidden text-[9px] text-slate-400 font-normal mt-0.5">{{ u.phone || 'No phone' }}</div>
                      </div>
                      <div class="hidden sm:block text-[10px] text-slate-400 font-mono mt-1">{{ u.id }}</div>
                    </td>
                    <td class="px-6 py-4 hidden lg:table-cell">
                      <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-tight">{{ u.shop_type || 'Retail' }}</span>
                    </td>
                    <td class="px-6 py-4 text-slate-700 text-xs font-semibold hidden md:table-cell">{{ u.phone || '—' }}</td>
                    <td class="px-6 py-4 text-slate-500 text-xs hidden md:table-cell">{{ u.email || '—' }}</td>
                    <td class="px-6 py-4 hidden lg:table-cell"><code class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-mono">{{ u.business_id || '—' }}</code></td>
                    <td class="px-6 py-4 hidden sm:table-cell">
                       <div v-if="u.devices && u.devices.length > 0" class="flex items-center gap-1">
                          <span class="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">{{ u.devices.length }}</span>
                          <span class="text-[10px] text-slate-400 uppercase font-bold">Linked</span>
                       </div>
                       <span v-else class="text-slate-300 text-[10px] italic">None</span>
                    </td>
                    <td class="px-6 py-4 hidden xl:table-cell">
                      <div class="text-[10px] text-slate-500 font-medium">{{ fmtDate(u.last_sync_date) }}</div>
                      <div class="text-[9px] text-slate-400 font-mono">{{ u.last_sync_date ? new Date(u.last_sync_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '' }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div :class="['inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight', planBadge(u.subscription?.plan)]">
                        {{ u.subscription?.plan || 'trial' }}
                      </div>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] text-slate-400">Exp: {{ fmtDate(u.subscription?.expiry_date) }}</span>
                        <button @click="openSubEditor(u)" class="text-blue-500 hover:text-blue-700 transition" title="Edit Subscription">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                       <div class="flex items-center justify-center gap-3">
                         <div :class="['w-3 h-3 rounded-full', u.subscription?.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300']"></div>
                         <button @click="userToDelete = u" class="p-1.5 text-slate-300 hover:text-red-500 transition" title="Delete User">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                         </button>
                       </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ── Delete User Modal ── -->
        <div v-if="userToDelete" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-red-900/40 backdrop-blur-sm">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 border-2 border-red-500/20">
            <div class="p-8 text-center">
              <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center text-2xl mb-4">⚠️</div>
              <h3 class="text-xl font-bold text-slate-900">Delete User?</h3>
              <p class="text-slate-500 text-sm mt-2 mb-6 uppercase tracking-tight font-semibold">Permanently remove <br/><span class="text-red-600 underline">{{ userToDelete.shop_name }}</span>?</p>
              
              <div class="space-y-4 text-left">
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Enter Secret PIN to Confirm</label>
                  <input type="password" v-model="deletePin" maxlength="6" placeholder="••••" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-bold tracking-widest focus:border-red-500 focus:outline-none transition-all" />
                </div>
                
                <div class="flex gap-3">
                  <button @click="userToDelete = null; deletePin = ''" class="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition">Cancel</button>
                  <button @click="confirmDelete" :disabled="!deletePin" class="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition disabled:opacity-30">Delete Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Sub Editor Modal ── -->
        <div v-if="editingUser" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div class="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 class="font-bold">Edit Subscription</h3>
              <button @click="editingUser = null" class="text-slate-400 hover:text-white transition">✕</button>
            </div>
            <div class="p-6 space-y-5">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Shop Name</label>
                <div class="text-sm font-bold text-slate-900">{{ editingUser.shop_name }}</div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Shop Type</label>
                <div class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ editingUser.shop_type || 'Retail' }}</div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Plan Type</label>
                <select v-model="subForm.plan" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  <option value="trial">Trial</option>
                  <option v-for="p in plans" :key="p.id" :value="p.name">{{ p.name }} ({{ p.duration }} days)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Expiry Date</label>
                <input type="date" v-model="subForm.expiry" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Paid Amount (₹)</label>
                <input type="number" v-model="subForm.paidAmount" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <div class="text-xs font-bold text-slate-900">Subscription Active</div>
                  <div class="text-[10px] text-slate-400">If disabled, POS app will block access</div>
                </div>
                <button 
                  @click="subForm.active = !subForm.active"
                  :class="['w-12 h-6 rounded-full transition-colors relative', subForm.active ? 'bg-emerald-500' : 'bg-slate-300']"
                >
                  <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', subForm.active ? 'left-7' : 'left-1']"></div>
                </button>
              </div>
              <div class="flex gap-3 pt-2">
                <button @click="editingUser = null" class="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Cancel</button>
                <button @click="saveSubscription" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition">Save Changes</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Plan Editor Modal ── -->
        <div v-if="showPlanModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div class="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 class="font-bold">{{ editingPlan ? 'Edit' : 'Add New' }} Plan</h3>
              <button @click="showPlanModal = false" class="text-slate-400 hover:text-white transition">✕</button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Plan Name</label>
                <input v-model="planForm.name" placeholder="e.g. Monthly Pro" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Duration (Days)</label>
                  <input type="number" v-model="planForm.duration" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Price (₹)</label>
                  <input type="number" v-model="planForm.price" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">UPI ID for Payment</label>
                <input v-model="planForm.upi_id" placeholder="e.g. billso@upi" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Notes / Features</label>
                <textarea v-model="planForm.notes" rows="3" placeholder="Features of this plan..." class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"></textarea>
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <div class="text-xs font-bold text-slate-900">Show in App</div>
                  <div class="text-[10px] text-slate-400">If disabled, users can't see this plan</div>
                </div>
                <button 
                  @click="planForm.show_in_app = !planForm.show_in_app"
                  :class="['w-12 h-6 rounded-full transition-colors relative', planForm.show_in_app ? 'bg-emerald-500' : 'bg-slate-300']"
                >
                  <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', planForm.show_in_app ? 'left-7' : 'left-1']"></div>
                </button>
              </div>
              <div class="flex gap-3 pt-2">
                <button @click="showPlanModal = false" class="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Cancel</button>
                <button @click="savePlan" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition">Save Plan</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ─────────── PAYMENTS ───────────────────────────── -->
        <div v-if="activeTab === 'payments'">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-100">
              <h2 class="font-bold text-slate-800">Payment Requests ({{ filteredPayments.length }})</h2>
              <!-- Filter tabs -->
              <div class="flex gap-2">
                <button
                  v-for="s in (['all','pending','approved','rejected'] as const)"
                  :key="s"
                  @click="payFilter = s"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-semibold border transition capitalize',
                    payFilter === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  ]"
                >{{ s }}</button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th class="px-6 py-3 text-left font-semibold">Shop Name</th>
                    <th class="px-6 py-3 text-left font-semibold hidden lg:table-cell">Business ID</th>
                    <th class="px-6 py-3 text-left font-semibold hidden sm:table-cell">Plan</th>
                    <th class="px-6 py-3 text-left font-semibold">Amount</th>
                    <th class="px-6 py-3 text-left font-semibold hidden md:table-cell">UTR</th>
                    <th class="px-6 py-3 text-left font-semibold hidden xl:table-cell">Date</th>
                    <th class="px-6 py-3 text-left font-semibold">Status</th>
                    <th class="px-6 py-3 text-left font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="filteredPayments.length === 0">
                    <td colspan="8" class="text-center py-16 text-slate-400 text-sm">No payment requests found</td>
                  </tr>
                  <tr v-for="req in filteredPayments" :key="req.id" class="hover:bg-slate-50 transition">
                    <td class="px-6 py-4">
                      <div class="font-bold text-slate-900 truncate max-w-[120px] sm:max-w-none">{{ shopName(req) }}</div>
                      <div class="lg:hidden text-[9px] text-slate-400 font-mono mt-0.5 truncate max-w-[100px]">{{ req.business_id }}</div>
                    </td>
                    <td class="px-6 py-4 hidden lg:table-cell"><code class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono">{{ req.business_id || '—' }}</code></td>
                    <td class="px-6 py-4 hidden sm:table-cell"><span :class="['px-2.5 py-1 rounded-full text-[10px] font-bold capitalize', planBadge(req.plan)]">{{ req.plan }}</span></td>
                    <td class="px-6 py-4">
                      <div class="font-bold text-slate-900">₹{{ req.amount }}</div>
                      <div class="sm:hidden text-[9px] font-bold text-blue-600 uppercase">{{ req.plan }}</div>
                    </td>
                    <td class="px-6 py-4 hidden md:table-cell"><code class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono">{{ req.utr || '—' }}</code></td>
                    <td class="px-6 py-4 text-slate-400 text-xs hidden xl:table-cell">{{ fmtDate(req.created_at) }}</td>
                    <td class="px-6 py-4">
                      <span :class="['px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight', statusBadge(req.status)]">{{ req.status }}</span>
                      <div class="xl:hidden text-[9px] text-slate-400 mt-1 font-medium">{{ fmtDate(req.created_at) }}</div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div v-if="req.status === 'pending'" class="flex justify-end gap-1.5">
                        <button @click="approvePayment(req)" class="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition">✓</button>
                        <button @click="rejectPayment(req)" class="px-2.5 py-1.5 border border-red-400 text-red-500 hover:bg-red-50 text-[10px] font-bold rounded-lg transition">✕</button>
                      </div>
                      <span v-else class="text-slate-300 text-[10px]">Processed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ─────────── PLANS ──────────────────────────────── -->
        <div v-if="activeTab === 'plans'" class="space-y-6">
          
          <!-- Global Settings Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100">
              <h2 class="font-bold text-slate-800 flex items-center gap-2">
                <span v-html="ICONS.settings" class="text-slate-400"></span>
                Subscription Controls
              </h2>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Default Plan (for New Users)</label>
                <select v-model="subSettings.default_plan_id" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm capitalize">
                  <option value="">None (Trial by default)</option>
                  <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }} (₹{{ p.price }})</option>
                </select>
                <p class="text-[10px] text-slate-400 mt-1">Automatically assigned when a new user signs up.</p>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Temporary Plan (Post-Payment)</label>
                <select v-model="subSettings.temporary_plan_id" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm capitalize">
                  <option value="">None</option>
                  <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }} (₹{{ p.price }})</option>
                </select>
                <p class="text-[10px] text-slate-400 mt-1">Temporary plan given while admin approves the payment.</p>
              </div>
            </div>

            <div class="px-6 py-4 bg-slate-50 flex justify-end">
              <button @click="saveSubSettings" class="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">Save Changes</button>
            </div>
          </div>

          <!-- Plans List Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 class="font-bold text-slate-800 flex items-center gap-2">
                <span v-html="ICONS.plans" class="text-blue-500"></span>
                Available Plans
              </h2>
              <button @click="openPlanModal()" class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition">+ Add Plan</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th class="px-6 py-3 text-left font-semibold">Plan Name</th>
                    <th class="px-6 py-3 text-left font-semibold">Duration</th>
                    <th class="px-6 py-3 text-left font-semibold">Price</th>
                    <th class="px-6 py-3 text-left font-semibold">App Listing</th>
                    <th class="px-6 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="plans.length === 0">
                    <td colspan="5" class="text-center py-16 text-slate-400 text-sm">No plans defined yet. Add your first plan!</td>
                  </tr>
                  <tr v-for="p in plans" :key="p.id" class="hover:bg-slate-50 transition">
                    <td class="px-6 py-4">
                      <div class="font-bold text-slate-900">{{ p.name }}</div>
                      <div class="text-[10px] text-slate-400 truncate max-w-[200px]">{{ p.notes || 'No notes' }}</div>
                    </td>
                    <td class="px-6 py-4 font-medium text-slate-700">{{ p.duration }} Days</td>
                    <td class="px-6 py-4 font-black text-slate-900">₹{{ p.price }}</td>
                    <td class="px-6 py-4">
                      <span :class="['px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight', p.show_in_app ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400']">
                        {{ p.show_in_app ? 'Visible' : 'Hidden' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        <button @click="openPlanModal(p)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <button @click="deletePlan(p.id)" class="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ─────────── NOTIFICATIONS ──────────────────────── -->
        <div v-if="activeTab === 'notifications'" class="max-w-4xl space-y-6">
          <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="px-8 py-6 bg-slate-900 flex justify-between items-center text-white">
              <div>
                <h2 class="text-xl font-bold flex items-center gap-3">
                  <span v-html="ICONS.notifications" class="text-blue-400"></span>
                  App Welcome Notification
                </h2>
                <p class="text-slate-400 text-xs mt-1">Manage the message shown to users on their first open of the day.</p>
              </div>
              <button 
                @click="subSettings.notification_enabled = !subSettings.notification_enabled"
                :class="['w-14 h-7 rounded-full transition-all relative', subSettings.notification_enabled ? 'bg-blue-500' : 'bg-slate-700']"
              >
                <div :class="['absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm', subSettings.notification_enabled ? 'left-8' : 'left-1']"></div>
              </button>
            </div>

            <div class="p-8 space-y-8">
              <!-- Editor -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Notification Message</label>
                  <span class="text-[10px] font-bold text-slate-300">{{ (subSettings.notification_text || '').length }}/120 characters</span>
                </div>
                <textarea 
                  v-model="subSettings.notification_text"
                  rows="4"
                  maxlength="120"
                  class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-medium focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-200"
                  placeholder="Welcome to Billso POS! We are live with new features..."
                ></textarea>
              </div>

              <!-- Live Preview -->
              <div class="space-y-4">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Mobile App Preview</label>
                <div class="relative bg-slate-100 rounded-[40px] p-8 border-[6px] border-slate-200 flex items-center justify-center min-h-[400px]">
                  <div class="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-[34px]">
                     <div class="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
                  </div>
                  
                  <!-- Fake Screen Content -->
                  <div class="w-full max-w-[280px] bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 animate-in fade-in zoom-in slide-in-from-bottom-5 duration-500">
                    <div class="flex flex-col items-center text-center">
                      <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-xl mb-4" v-html="ICONS.sun"></div>
                      <h4 class="text-base font-bold text-slate-900">Welcome to Billso POS</h4>
                      <p class="text-xs text-slate-400 mt-1 mb-4">GOLD PLAN · Exp: 25 Dec 2026</p>
                      
                      <div class="w-full h-[1px] bg-slate-100 mb-4"></div>
                      
                      <p class="text-sm font-medium text-slate-700 leading-relaxed italic">
                        "{{ subSettings.notification_text || 'Your welcome message appears here...' }}"
                      </p>

                      <div class="w-full h-[1px] bg-slate-100 mt-4 mb-4"></div>
                      
                      <button class="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 pointer-events-none">OK</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
              <span class="text-xs text-slate-400 italic">Settings saved globally to all users</span>
              <button 
                @click="saveSubSettings" 
                class="px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >Push Changes Live</button>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ── Toast ── -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-3" leave-active-class="transition ease-in duration-200" leave-to-class="opacity-0 translate-y-3">
      <div
        v-if="toast"
        :class="[
          'fixed bottom-8 right-8 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold z-50 max-w-sm',
          toast.ok ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'
        ]"
      >{{ toast.msg }}</div>
    </Transition>
  </div>
</template>
