<script setup lang="ts">
import { onMounted, ref } from 'vue'

useSeoMeta({
  title: 'Billso POS - Smart Billing for Small Businesses',
  description: 'The fast, offline-first POS built for tea shops, grocery stores, and service businesses.',
})

const shopTypes = [
  { name: 'Tea / Coffee Shop', icon: 'coffee' },
  { name: 'Grocery Store', icon: 'shopping-cart' },
  { name: 'Snacks / Bakery', icon: 'cookie' },
  { name: 'Service Business', icon: 'wrench' },
  { name: 'Juice / Cool Bar', icon: 'glass-water' },
  { name: 'Street / Cart Shop', icon: 'truck' },
]

const features = [
  { title: 'Fast Billing', desc: 'Complete sales in seconds with one-tap checkout.', icon: 'zap' },
  { title: 'Works Offline', desc: 'No internet? No problem. Use all features anywhere.', icon: 'wifi-off' },
  { title: 'Inventory', desc: 'Track stock levels and get low-stock alerts.', icon: 'package' },
  { title: 'Service Jobs', desc: 'Manage pending jobs and work orders effortlessly.', icon: 'tools' },
  { title: 'Customer Credit', desc: 'Track Udhaar and customer balances easily.', icon: 'user' },
  { title: 'Backup System', desc: 'Your data is safe with automatic local backups.', icon: 'database' },
]

const iconMap: Record<string, string> = {
  coffee: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
  'shopping-cart': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  cookie: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>',
  wrench: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  'glass-water': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 22H8.8a1 1 0 0 1-1-.8l-1.3-13.8a1 1 0 0 1 1-1.1h9.1a1 1 0 0 1 1 1l-1.4 13.9a1 1 0 0 1-1 .8z"/><path d="M6.3 11a1 1 0 0 1 .4-1.8 1 1 0 0 0 .5-.2C8 8.4 9 8 12 8s4 .4 4.8 1a1 1 0 0 0 .5.2 1 1 0 0 1 .4 1.8"/></svg>',
  truck: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
  zap: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  'wifi-off': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M8.5 16.5c.9-1.3 2.5-2 4-2.1"/><path d="M15.4 17.5c.8-.7 1.3-1.6 1.6-2.5"/><path d="M11 11c-1-.1-2 .1-3 .5"/><path d="M16 11c.9.4 1.7.9 2.5 1.5"/><path d="M5.5 12.5c-.8-.7-1.4-1.6-1.7-2.5"/><path d="M12 5c3.2 0 6.2 1.3 8.3 3.5"/><path d="M4.1 8c.5-.5 1-.9 1.5-1.3"/><circle cx="12" cy="20" r="1"/></svg>',
  package: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>',
  tools: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.924 7.617a30 30 0 0 0-2.154 2.154A2 2 0 1 1 11 8.125a30.137 30.137 0 0 0 2.154-2.154 2 2 0 1 1 2.77 2.646Z"/><path d="M15 8h.01"/><path d="M12 11c-4.17 0-7 2-7 5v3c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3c0-3-2.83-5-7-5Z"/><path d="m2 22 5-5"/><path d="M20 2h2v2"/><path d="m21 3-5 5"/><path d="M3 3h2v2"/><path d="m4 4 5 5"/><path d="M19 22h2a2 2 0 0 0 2-2v-2"/></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  database: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>',
  cart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h1.8L5.2 6.5h16.3l-1.3 5.4a2 2 0 0 1-2 1.6H9.7l-1-4.7"/></svg>',
  bank: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
  chart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
  activity: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
}

const activeScrollImage = ref('/images/customer-managemetn.png')
const activeStepIndex = ref(0)

const scrollSteps = [
  { title: 'Customer Management', desc: 'Keep track of your customers effortlessly, track their balances and history in real-time.', img: '/images/customer-managemetn.png' },
  { title: 'Detailed Reports', desc: 'Gain intelligent insights into your sales, income, and business patterns with powerful analytics.', img: '/images/detailed-report-page.png' },
  { title: 'Job Management', desc: 'Manage pending jobs and work orders for your service business effortlessly from start to finish.', img: '/images/Job-management.png' },
  { title: 'Chart Analytics', desc: 'Visualize your success with clear, actionable charts and data to make smarter financial decisions.', img: '/images/analytics-chart.png' }
]

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

  const stackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute('data-index') || '0', 10)
        activeStepIndex.value = index
        activeScrollImage.value = scrollSteps[index].img
      }
    })
  }, { threshold: 0, rootMargin: '-50% 0px -49% 0px' })

  document.querySelectorAll('.tracker-item').forEach(el => stackObserver.observe(el))
})
</script>

<template>
  <div class="page-container">
    <TheNavbar />
    <HeroSection />
    <FeaturesSection :features="features" :icon-map="iconMap" />
    <WorkflowSection :scroll-steps="scrollSteps" :active-step-index="activeStepIndex" :active-scroll-image="activeScrollImage" />
    <DualPosShowcase :icon-map="iconMap" />
    <BusinessTypes :shop-types="shopTypes" :icon-map="iconMap" />
    <PricingSection />
    <CallToAction />
    <TheFooter />
  </div>
</template>

<style scoped>
.page-container {
  overflow-x: clip;
}

/* Animations */
:deep(.animate-on-scroll) {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s, transform 0.8s;
}

:deep(.animate-on-scroll.visible) {
  opacity: 1;
  transform: translateY(0);
}

/* Buttons utility - available globally through main.css, but keep basic layout here if needed */
:deep(.btn) {
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

:deep(.btn-lg) {
  padding: 16px 32px;
  font-size: 1.1rem;
}
</style>
