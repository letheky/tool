<template>
  <div class="map-container" @click="handleClick">
    <img src="/k9/map-9-3.webp" alt="" srcset="" />
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
</template>

<script setup>
import { ref } from "vue";

const clickedDots = ref([]);

const handleClick = (e) => {
  // Get the image element directly for accurate coordinates
  const img = document.querySelector(".map-container img");
  const rect = img.getBoundingClientRect();
  console.log(rect);

  // Calculate position relative to the actual image
  const xRelative = (e.clientX - rect.left)/rect.width;
  const yRelative = (e.clientY - rect.top)/rect.height;

  // Use the actual image dimensions from getBoundingClientRect()
  // This accounts for object-fit: cover which may make the image much larger than container
  const xPx = xRelative *100;
  const yPx = yRelative *100;

  console.log(xPx.toFixed(2), yPx.toFixed(2));
  // Add the clicked position to the dots array
  clickedDots.value.push({
    x: (xPx).toFixed(2),
    y: (yPx).toFixed(2),
  });

  alert(`Clicked at:\nToạ độ: (left: ${xPx.toFixed(2)} %, top: ${yPx.toFixed(2)} %)`);
};
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative; // Add this
  // top: -85%;

  img {
    width: 100%; // Changed from 75%
    height: 100%;
    object-fit: cover;
    position: absolute; // Changed from absolute
    top: 50%;
    transform: translateY(-50%);

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
