<template>
  <div class="main">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.main {
  width: 100vw;
  height: 100vh;
}
</style>
