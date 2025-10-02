<template>
  <div class="about" @click="handleClick">
    <div class="map">
      <img src="/k3/map.webp" alt="" srcset="" />
      <div
        v-for="(dot, index) in clickedDots"
        :key="index"
        class="red-dot"
        :style="{
          left: dot.x + '%',
          top: dot.y + '%',
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const clickedDots = ref([]);

const handleClick = (e) => {
  const map = document.querySelector(".map");
  const rect = map.getBoundingClientRect();

  // Calculate position relative to the map container
  const xRelative = e.clientX - rect.left;
  const yRelative = e.clientY - rect.top;

  const xPercent = ((xRelative / rect.width) * 100).toFixed(2);
  const yPercent = ((yRelative / rect.height) * 100).toFixed(2);

  // Add the clicked position to the dots array
  clickedDots.value.push({
    x: parseFloat(xPercent),
    y: parseFloat(yPercent),
  });

  alert(`Clicked at:\nToạ độ: (${xPercent}, ${yPercent})`);
};
</script>

<style lang="scss" scoped>
.about {
  background-color: #fff;
  width: 100vw;
  height: 100dvh;
  position: relative;
  display: flex;
  justify-content: end;

  .map {
    width: 75%;
    height: 100%;
    img {
      width: 120%;
      height: 120%;
      object-fit: contain;
      pointer-events: none;
      user-drag: none;
      user-select: none;
      transform: translate(-20rem, -20rem);
    }
    
  }

  .red-dot {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: red;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 10;
  }
}
</style>
