<template>
  <nav class="navbar glass">
    <div class="container nav-inner">
      <div class="logo">
        <div class="logo-icon">B</div>
        <span class="logo-text">Billso POS</span>
      </div>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#shop-types">Shop Types</a>
        <a href="#pricing">Pricing</a>
        <a href="/billso-pos-admin/" class="admin-link">Admin Panel</a>
      </div>
      <a href="/application/app-release.apk" download="app-release.apk" class="btn btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">Download App</a>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  height: 72px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 16px;
  margin: 0 16px;
  border-radius: 20px;
  z-index: 100;
  box-shadow: var(--shadow);
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  background: var(--accent);
  color: white;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  font-weight: 800;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-links a {
  color: var(--muted);
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--accent);
}

.admin-link {
  color: var(--accent) !important;
  font-weight: 600 !important;
}

@media (max-width: 768px) {
  .nav-links { display: none; }
}
</style>
