<template>
  <div class="about">
    <div class="map-container" @click="handleClick">
      <img src="/k8/map.png" alt="" srcset="">
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
  // Get the image element directly for accurate coordinates
  const img = document.querySelector(".map-container img");
  const rect = img.getBoundingClientRect();
  
  // Calculate position relative to the actual image
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

  .map-container {
    width: 75%;
    height: 100%;
    position: relative; // Add this
    
    img {
      width: 100%; // Changed from 75%
      object-fit: cover;
      position: absolute; // Changed from absolute
      top:-75%;
      // Removed top: -75%
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