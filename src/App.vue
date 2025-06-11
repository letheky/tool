<template>
  <div class="about" @click="handleClick">
    <img class="map" src="/map.png" alt="" />
  </div>
</template>

<script setup>
const handleClick = (e) => {
  const clientX = e.clientX;
  const clientY = e.clientY;
  alert(
    `Clicked at:\nToạ độ: (${((clientX / window.innerWidth) * 100).toFixed(2)}, ${
      ((clientY / window.innerHeight) * 100).toFixed(2)
    })`
  );
};
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
