<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: var(--color-bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
