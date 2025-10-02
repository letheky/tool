<template>
  <div class="about" @click="handleClick">
    <div class="container">
      <MapContainerv2 mapImgSource="/k10/map10.jpg" />
    </div>
  </div>
</template>

<script setup>
import MapContainerv2 from "../components/MapContainerv2.vue";
</script>

<style lang="scss" scoped>
.about {
  background-color:#fff;
  width: 100vw;
  height: 100dvh;
  .container {
    width: 75%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
