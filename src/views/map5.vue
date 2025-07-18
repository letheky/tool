<template>
  <div class="about" @click="handleClick">
    <MapContainer mapImgSource="/k5/map.webp" />
  </div>
</template>

<script setup>
import MapContainer from "../components/MapContainer.vue";

</script>

<style lang="scss" scoped>
.about {
  background-color: #ffdeac;
  width: 100vw;
  height: 100%;
}
</style>
