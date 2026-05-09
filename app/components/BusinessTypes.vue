<script setup lang="ts">
defineProps<{
  shopTypes: Array<{ name: string, icon: string }>,
  iconMap: Record<string, string>
}>()
</script>

<template>
  <section id="shop-types" class="section">
    <div class="container">
      <div class="section-head text-center animate-on-scroll">
        <h2>Built for Every Business</h2>
        <p>Choose your business type and Billso POS adapts to your needs.</p>
      </div>
      <div class="shop-grid">
        <div v-for="s in shopTypes" :key="s.name" class="shop-card animate-on-scroll">
          <div class="s-icon" v-html="iconMap[s.icon]"></div>
          <span>{{ s.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section { padding: 100px 0; }
.section-head { margin-bottom: 80px; }
.section-head h2 { font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 20px; }

.shop-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.shop-card {
  background: var(--bg-soft);
  padding: 32px 40px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid transparent;
  font-weight: 700;
  font-family: var(--font-heading);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.shop-card:hover {
  background: white;
  border-color: var(--accent);
  box-shadow: var(--shadow-premium);
  transform: translateY(-4px);
}

.s-icon { width: 24px; height: 24px; color: var(--accent); }
:deep(.s-icon svg) { width: 100%; height: 100%; }

@media (max-width: 1024px) { .shop-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 768px) { .shop-grid { grid-template-columns: 1fr; } }
</style>
