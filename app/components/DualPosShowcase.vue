<script setup lang="ts">
defineProps<{ iconMap: Record<string, string> }>()
</script>

<template>
  <section id="multi-pos" class="section">
    <div class="container">
      <div class="section-head text-center animate-on-scroll">
        <div class="badge">VERSATILE SOLUTION</div>
        <h2>Multi POS System</h2>
        <p>Product POS & Service POS - All in one powerful platform tailored for your specific needs.</p>
      </div>

      <!-- Product POS -->
      <div class="pos-row animate-on-scroll">
        <div class="pos-text">
          <h3>Product POS</h3>
          <p>Perfect for retail stores, supermarkets, and boutiques. Advanced inventory control and smooth billing flow.</p>
          <ul class="pos-features">
            <li><span v-html="iconMap['package']"></span> Inventory Tracking</li>
            <li><span v-html="iconMap['cart']"></span> Purchases Control</li>
            <li><span v-html="iconMap['bank']"></span> Accounts Ledgers</li>
            <li><span v-html="iconMap['chart']"></span> Business Analytics</li>
          </ul>
        </div>
        <div class="pos-image-container phone-mask-container">
          <div class="phone-frame-small">
            <div class="phone-screen-small">
              <img src="/images/dashbord.png" alt="Product POS Dashboard" />
            </div>
          </div>
        </div>
      </div>

      <!-- Service POS -->
      <div class="pos-row reverse animate-on-scroll">
        <div class="pos-image-container phone-mask-container">
          <div class="phone-frame-small">
            <div class="phone-screen-small">
              <img src="/images/servise-pos-dashbord.png" alt="Service POS Dashboard" />
            </div>
          </div>
        </div>
        <div class="pos-text">
          <h3>Service POS</h3>
          <p>Designed for mobile repair shops, workshops, and service centers. Focus on customers and job lifecycle.</p>
          <ul class="pos-features">
            <li><span v-html="iconMap['user']"></span> Customer Management</li>
            <li><span v-html="iconMap['activity']"></span> Job Tracking</li>
            <li><span v-html="iconMap['chart']"></span> Detailed Analytics</li>
            <li><span v-html="iconMap['calendar']"></span> Status History</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section { padding: 100px 0; }

.section-head { margin-bottom: 80px; }
.section-head h2 { font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 20px; }
.section-head p { color: var(--muted); font-size: 1.2rem; }

.badge {
  display: inline-block;
  padding: 6px 12px;
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 24px;
}

.pos-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 80px;
  align-items: center;
  margin-bottom: 120px;
}
.pos-row.reverse { grid-template-columns: 1fr 1.5fr; }

.pos-text h3 { font-size: 2.8rem; margin-bottom: 24px; }
.pos-text p { font-size: 1.15rem; color: var(--muted); margin-bottom: 40px; }

.pos-features {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}
.pos-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  padding: 16px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.pos-features li span { width: 20px; height: 20px; color: var(--accent); display: flex; }
:deep(.pos-features li span svg) { width: 100%; height: 100%; }

.pos-features li:hover {
  background: white;
  border-color: var(--accent);
  box-shadow: var(--shadow-premium);
  transform: translateY(-4px);
}

.phone-mask-container {
  background: #f8fafc;
  border-radius: 40px;
  height: 400px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding-top: 40px;
  border: 1px solid var(--line);
  position: relative;
}
.phone-frame-small { width: 200px; height: 420px; border-radius: 32px; padding: 7px; flex-shrink: 0; }
.phone-screen-small { width: 100%; height: 100%; background: #fff; border-radius: 25px; overflow: hidden; }
.phone-screen-small img { width: 100%; height: 100%; object-fit: cover; object-position: top; }

@media (max-width: 991px) {
  .pos-row, .pos-row.reverse { grid-template-columns: 1fr; text-align: center; }
  .pos-row.reverse .pos-image-container { order: 2; }
}
</style>
