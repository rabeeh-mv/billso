<script setup lang="ts">
import { LucideCheck } from 'lucide-vue-next'

const checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
const lockIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
const wandIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path><path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path></svg>'
</script>

<template>
  <section id="pricing" class="pricing-section section">
    <div class="container" style="max-width: 1140px; margin: 0 auto;">
      <div class="reveal">
        <div class="section-tag">Pricing</div>
        <h2 class="section-h">Simple, transparent pricing</h2>
        <p class="section-p">Start with a <strong>7 Days free trial</strong>. Upgrade when you are ready to grow your business.</p>
      </div>

      <div class="pricing-grid">
        <!-- Monthly Plan -->
        <div class="plan-card reveal" style="transition-delay: 0.1s;">
          <div class="plan-nm">Monthly</div>
          <div class="plan-pr"><sup>₹</sup>250</div>
          <div class="plan-pd">30 Days</div>
          <p class="plan-desc">Perfect for small shops starting out.</p>
          <div class="plan-div"></div>
          <ul class="plan-feats">
            <li><span class="chk chk-blue" v-html="checkIcon"></span> Unlimited Bills</li>
            <li><span class="chk chk-blue" v-html="checkIcon"></span> Inventory Management</li>
            <li><span class="chk chk-blue" v-html="checkIcon"></span> Customer Udhaar</li>
            <li><span class="chk chk-blue" v-html="checkIcon"></span> Local Offline Backup</li>
          </ul>
          <button class="btn-plan btn-plan-out">Start 7 Days Free Trial</button>
        </div>

        <!-- 6 Months Plan -->
        <div class="plan-card reveal" style="transition-delay: 0.2s;">
          <div class="plan-nm">6 Months</div>
          <div class="plan-pr"><sup>₹</sup>1350</div>
          <div class="plan-pd">183 Days</div>
          <p class="plan-desc">Great for growing businesses.</p>
          <div class="plan-div"></div>
          <ul class="plan-feats">
            <li><span class="chk chk-green" v-html="checkIcon"></span> Everything in Monthly</li>
            <li><span class="chk chk-green" v-html="checkIcon"></span> Job Management</li>
            <li><span class="chk chk-green" v-html="checkIcon"></span> Detailed Analytics</li>
            <li><span class="chk chk-green" v-html="checkIcon"></span> Priority Support</li>
          </ul>
          <button class="btn-plan btn-plan-out">Start 7 Days Free Trial</button>
        </div>

        <!-- Yearly Plan (Highlighted) -->
        <div class="plan-card pop reveal" style="transition-delay: 0.3s;">
          <div class="pop-lbl">Best Value</div>
          <div class="plan-nm" style="color: #3b82f6;">Yearly</div>
          <div class="plan-pr"><sup>₹</sup>2399</div>
          <div class="plan-pd">1 Year (365 Days)</div>
          <p class="plan-desc">Maximum savings for established businesses.</p>
          <div class="plan-div"></div>
          <ul class="plan-feats">
            <li><span class="chk chk-blue" style="background: #3b82f6; color: #fff;" v-html="checkIcon"></span> Everything in 6 Months</li>
            <li><span class="chk chk-blue" style="background: #3b82f6; color: #fff;" v-html="checkIcon"></span> Multi-device Sync</li>
            <li><span class="chk chk-blue" style="background: #3b82f6; color: #fff;" v-html="checkIcon"></span> Custom Invoice Branding</li>
            <li><span class="chk chk-blue" style="background: #3b82f6; color: #fff;" v-html="checkIcon"></span> 24/7 Dedicated Support</li>
          </ul>
          <button class="btn-plan btn-plan-fill">Start 7 Days Free Trial</button>
        </div>

        <!-- Customized Premium Plan -->
        <div class="plan-card reveal" style="transition-delay: 0.4s;">
          <div class="plan-nm">Customized Premium</div>
          <div class="plan-pr" style="font-size: 32px; padding-top: 6px; padding-bottom: 4px;">Custom</div>
          <div class="plan-pd">Tailored to your needs</div>
          <p class="plan-desc">For enterprises with specific requirements.</p>
          <div class="plan-div"></div>
          <ul class="plan-feats">
            <li><span class="chk chk-blue" v-html="wandIcon"></span> Custom Features</li>
            <li><span class="chk chk-blue" v-html="wandIcon"></span> Multi-store Management</li>
            <li><span class="chk chk-blue" v-html="wandIcon"></span> Advanced Integrations</li>
            <li><span class="chk chk-blue" v-html="wandIcon"></span> On-site Training</li>
          </ul>
          <button class="btn-plan btn-plan-out">Contact Sales</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Optional specific overrides here. Mostly relying on main.css */
</style>
