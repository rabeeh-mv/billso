<template>
  <section class="section container">
    <div class="cta-banner animate-on-scroll">
      <h2>Ready to upgrade your shop?</h2>
      <p>Start billing faster and manage your inventory with ease. Download Billso POS today.</p>
      <div class="cta-btns">
        <a href="/application/app-release.apk" download="app-release.apk" class="btn btn-light btn-lg" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">Download App</a>
        <button class="btn btn-outline-white btn-lg">Contact Sales</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section { padding: 100px 0; }

.cta-banner {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  padding: 100px 48px;
  border-radius: 48px;
  color: white;
  text-align: center;
  box-shadow: var(--shadow-premium);
}

.cta-banner h2 { font-size: clamp(2rem, 6vw, 3.5rem); margin-bottom: 24px; }
.cta-banner p { font-size: clamp(1.1rem, 2vw, 1.25rem); margin-bottom: 48px; opacity: 0.9; max-width: 600px; margin: 0 auto; }

.cta-btns { display: flex; justify-content: center; gap: 16px; }

.btn { padding: 12px 24px; border-radius: 999px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; }
.btn-lg { padding: 16px 32px; font-size: 1.1rem; }
.btn-light { background: white; color: var(--accent); }
.btn-outline-white { background: transparent; border: 1px solid rgba(255,255,255,0.4); color: white; }

@media (max-width: 768px) { .cta-btns { flex-direction: column; } }
</style>
