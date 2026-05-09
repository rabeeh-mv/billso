<script setup lang="ts">
defineProps<{
  features: Array<{ title: string, desc: string, icon: string }>,
  iconMap: Record<string, string>
}>()
</script>

<template>
  <section id="features" class="section bg-soft">
    <div class="container">
      <div class="section-head text-center animate-on-scroll">
        <h2>Everything You Need to Run Your Business</h2>
        <p>Powerful features packed into a simple, easy-to-use interface.</p>
      </div>
      <div class="features-grid">
        <div v-for="f in features" :key="f.title" class="feature-card animate-on-scroll">
          <div class="f-icon" v-html="iconMap[f.icon]"></div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 100px 0;
}

.bg-soft {
  background: var(--bg-soft);
}

.section-head {
  margin-bottom: 80px;
}

.section-head h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 20px;
  letter-spacing: -0.03em;
}

.section-head p {
  color: var(--muted);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.feature-card {
  background: white;
  padding: 48px;
  border-radius: 32px;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover {
  transform: translateY(-8px);
}

.f-icon {
  width: 48px;
  height: 48px;
  color: var(--accent);
  margin-bottom: 24px;
}

:deep(.f-icon svg) {
  width: 100%;
  height: 100%;
}

@media (max-width: 1024px) {
  .features-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
}
</style>
