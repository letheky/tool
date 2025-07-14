<template>
  <div class="about" @click="handleClick">
    <MapContainer />
  </div>
</template>

<script setup>
import MapContainer from "../components/MapContainer.vue";

</script>

<style lang="scss" scoped>
.about {
  background-color: #ffdeac;
  width: 100vw;
  height: 100dvh;
  .map {
    width: 100%;
    height: 106%;
    object-fit: cover;
    position: absolute;
    right: -14%;
    top: -3%;
  }
}
</style>
