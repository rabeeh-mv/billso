<script setup lang="ts">
defineProps<{
  scrollSteps: Array<{ title: string, desc: string, img: string }>,
  activeStepIndex: number,
  activeScrollImage: string
}>()
</script>

<template>
  <section class="scroll-stack-section">
    <div class="container section-head text-center animate-on-scroll scroll-stack-header">
      <h2>Powerful Workflows</h2>
      <p>A seamless experience to manage and grow your business.</p>
    </div>

    <div class="stack-track">
      <div class="trackers-container">
        <div v-for="(s, i) in scrollSteps" :key="`tracker-${i}`" class="tracker-item" :data-index="i"></div>
      </div>

      <div class="scroll-stack-pinned">
        <div class="pinned-content container">
          <div class="visual-item">
            <div class="image-wrapper">
              <img :src="activeScrollImage" class="raw-visual-img" />
            </div>
          </div>

          <div class="pinned-texts">
            <div 
              v-for="(s, i) in scrollSteps" 
              :key="i"
              class="pinned-step-card" 
              :class="[
                { 'active': activeStepIndex === i, 
                  'passed': activeStepIndex > i,
                  'upcoming': activeStepIndex < i
                },
                i % 2 === 0 ? 'pos-left' : 'pos-right'
              ]"
            >
              <h3>{{ s.title }}</h3>
              <p>{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mobile-steps-list">
        <div v-for="(s, i) in scrollSteps" :key="`mobile-${i}`" class="mobile-step-item">
          <div class="mobile-step-visual">
            <img :src="s.img" :alt="s.title" class="mobile-img" />
          </div>
          <div class="mobile-step-content container">
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scroll-stack-section {
  position: relative;
  background: radial-gradient(circle at center, #ebf2ff 0%, #f4f8ff 100%);
  overflow: visible;
}

.scroll-stack-header {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  z-index: 30;
  margin: 0 auto;
}

.stack-track {
  position: relative;
  height: 400vh;
}

.trackers-container {
  position: absolute;
  top: 0; left: 0; right: 0; height: 100%;
  display: flex; flex-direction: column;
}
.tracker-item { height: 100vh; }

.scroll-stack-pinned {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pinned-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.visual-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  z-index: 5;
}

.image-wrapper {
  width: 100%;
  height: 70vh;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.raw-visual-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pinned-step-card {
  position: absolute;
  top: 50%;
  width: 340px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  border-radius: 32px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,1);
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.pinned-step-card.pos-left { left: 0; }
.pinned-step-card.pos-right { right: 0; }

.pinned-step-card.active {
  transform: translateY(-50%) scale(1);
  opacity: 1;
  z-index: 10;
}
.pinned-step-card.passed {
  transform: translateY(calc(-50% - 100px)) scale(0.9);
  opacity: 0;
}
.pinned-step-card.upcoming {
  transform: translateY(calc(-50% + 100px)) scale(0.9);
  opacity: 0;
}

.pinned-step-card h3 {
  font-size: 1.8rem;
  margin-bottom: 16px;
}

.pinned-step-card p {
  font-size: 1.05rem;
  color: var(--muted);
}

.mobile-steps-list {
  display: none;
}

@media (max-width: 1024px) {
  .scroll-stack-section { padding-top: 60px; }
  .scroll-stack-header { position: relative; top: 0; margin-bottom: 40px; padding: 0 20px; }
  .stack-track { height: auto; }
  .scroll-stack-pinned { display: none; }
  
  .mobile-steps-list {
    display: flex;
    flex-direction: column;
    gap: 80px;
    padding: 20px 20px 80px 20px;
  }
  
  .mobile-step-item {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    text-align: center;
  }
  
  .mobile-step-visual {
    width: 100%;
    max-width: 320px;
    border-radius: 28px;
    overflow: hidden;
    background: transparent;
    display: flex;
    justify-content: center;
  }
  
  .mobile-img { 
    width: 100%; 
    height: auto; 
    object-fit: contain; 
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  }
  
  .mobile-step-content h3 {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 12px;
    color: #0f172a;
  }
  
  .mobile-step-content p {
    font-size: 1rem;
    color: #64748b;
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
