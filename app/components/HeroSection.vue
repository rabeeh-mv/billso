<template>
  <header class="hero">
    <div class="container hero-grid">
      <div class="hero-content animate-on-scroll">
        <div class="badge">PRO VERSION READY</div>
        <h1>Scale Your Business with the <span class="text-gradient">Smartest POS</span></h1>
        <p>
          Experience lightning-fast billing that works anywhere — even without internet. Built specifically for modern shops, bakeries, and retail entrepreneurs.
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg">Get Started Free</button>
          <button class="btn btn-outline btn-lg">Watch Demo</button>
        </div>
      </div>
      <div class="hero-visual animate-on-scroll">
        <div class="browser-mockup">
          <div class="browser-header">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
          <img src="/images/dashbord.png" alt="Billso POS Dashboard" class="hero-dashboard-img" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero {
  padding: 160px 0 80px 0;
  background: radial-gradient(circle at top right, #EEF2FF 0%, transparent 40%),
              radial-gradient(circle at top left, #F0F9FF 0%, transparent 40%);
  overflow: hidden;
}

.hero-grid {
  display: flex;
  flex-direction: column;
  gap: 64px;
  align-items: center;
}

.hero-content {
  max-width: 900px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-content h1 {
  font-size: clamp(3rem, 8vw, 5.5rem);
  line-height: 1;
  margin-bottom: 32px;
  letter-spacing: -0.04em;
}

.hero-content p {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: var(--muted);
  margin-bottom: 48px;
  max-width: 640px;
  line-height: 1.5;
}

.hero-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 48px;
  justify-content: center;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: 0.05em;
}

.text-gradient {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-visual {
  width: 100%;
  max-width: 1100px;
}

.hero-dashboard-img {
  width: 50%;
  justify-content: center;
  display: flex;
  align-items: center;
  margin: auto;
  border-radius: 12px;
  box-shadow: var(--shadow-premium);
}

.browser-mockup {
  background: white;
  border-radius: 20px;
  border: 1px solid var(--line);
  padding: 8px;
  box-shadow: var(--shadow-premium);
}

.browser-header {
  display: flex;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .hero-dashboard-img {
    width: 90%;
  }
}
</style>
