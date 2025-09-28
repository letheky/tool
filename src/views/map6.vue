<template>
  <div class="about" @click="handleClick">
    <div class="container">
      <MapContainerv2 mapImgSource="/k6/map.webp" />
    </div>
  </div>
</template>

<script setup>
import MapContainerv2 from "../components/MapContainerv2.vue";
</script>

<style lang="scss" scoped>
.about {
  background-color: #ffdeac;
  width: 100vw;
  height: 100dvh;
  .container {
    width: 73%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
