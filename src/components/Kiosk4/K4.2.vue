<template>
  <div class="map-container" @click="handleClick">
    <img src="/k4/map-4-2.png" alt="" srcset="" />
    <div
      v-for="(dot, index) in clickedDots"
      :key="index"
      class="red-dot"
      :style="{
        left: dot.x + 'px',
        top: dot.y + 'px',
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const clickedDots = ref([]);

const handleClick = (e) => {
  // Get the image element directly for accurate coordinates
  const img = document.querySelector(".map-container img");
  const rect = img.getBoundingClientRect();

  // Calculate position relative to the actual image
  const xRelative = e.clientX - rect.left;
  const yRelative = e.clientY - rect.top;

  // Use the actual image dimensions from getBoundingClientRect()
  // This accounts for object-fit: cover which may make the image much larger than container
  const xPx = xRelative;
  const yPx = yRelative;

  console.log(xPx, yPx);
  // Add the clicked position to the dots array
  clickedDots.value.push({
    x: parseFloat(xPx),
    y: parseFloat(yPx),
  });

  alert(`Clicked at:\nToạ độ: (left: ${xPx}, top: ${yPx})`);
};
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative; // Add this
  top: -90%;

  img {
    width: 100%; // Changed from 75%
    object-fit: cover;
    position: absolute; // Changed from absolute

    // Removed top: -75%
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
