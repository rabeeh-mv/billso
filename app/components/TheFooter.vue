<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="f-brand">
        <div class="logo">
          <div class="logo-icon">B</div>
          <span class="logo-text">Billso POS</span>
        </div>
        <p>Modern POS solution for tomorrow's entrepreneurs.</p>
      </div>
      <div class="f-links">
        <h4>Product</h4>
        <a href="#">Features</a>
        <a href="#">Pricing</a>
        <a href="#">Updates</a>
      </div>
      <div class="f-links">
        <h4>Support</h4>
        <a href="#">Help Center</a>
        <a href="#">Contact Us</a>
        <a href="#">Feedback</a>
      </div>
      <div class="f-links">
        <h4>Legal</h4>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
    </div>
    <div class="container f-bottom">
      <p>© 2026 Billso POS. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer { padding: 80px 0 40px; border-top: 1px solid var(--line); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 60px; }
.f-brand p { margin-top: 20px; color: var(--muted); }
.f-links h4 { margin-bottom: 20px; }
.f-links { display: flex; flex-direction: column; gap: 12px; }
.f-links a { color: var(--muted); transition: color 0.2s; }
.f-links a:hover { color: var(--accent); }
.f-bottom { padding-top: 40px; border-top: 1px solid var(--line); color: var(--muted); font-size: 0.9rem; }

.logo { display: flex; align-items: center; gap: 12px; }
.logo-icon { background: var(--accent); color: white; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; font-weight: 800; }
.logo-text { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }

@media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }
</style>
