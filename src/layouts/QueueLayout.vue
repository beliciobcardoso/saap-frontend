<template>
  <div class="queue-layout">
    <slot />
  </div>
</template>

<style scoped>
.queue-layout {
  min-height: 100vh;
  background-color: var(--color-primary-950);
  color: white;
  display: flex;
  flex-direction: column;
}
</style>
