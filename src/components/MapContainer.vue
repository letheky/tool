<template>
  <div class="map-zoom-container" ref="containerRef">
    <div
      class="map-wrapper"
      ref="mapWrapperRef"
      :style="{
        transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
        transformOrigin: '0 0',
      }"
      @mousedown="startPan"
      @touchstart="startPan"
      @wheel="handleWheel"
    >
      <img :src="mapImgSource" alt="map" class="map-image" draggable="false" />

      <!-- Red dot markers for click positions -->
      <div
        v-for="position in clickPositions"
        :key="position.id"
        class="click-marker"
        :style="{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${1 / zoomLevel})`,
          transformOrigin: 'center center',
        }"
      ></div>
    </div>

    <!-- Zoom Controls -->
    <div class="zoom-controls">
      <button
        class="zoom-btn zoom-in"
        @click="zoomIn"
        :disabled="zoomLevel >= maxZoom"
      >
        <img
          :style="{ opacity: zoomLevel >= maxZoom ? 0.5 : 1 }"
          src="/zoom-in.svg"
          alt="zoom-in"
        />
      </button>
      <div class="zoom-line"></div>
      <button
        class="zoom-btn zoom-out"
        @click="zoomOut"
        :disabled="zoomLevel <= minZoom"
      >
        <img
          :style="{ opacity: zoomLevel <= minZoom ? 0.5 : 1 }"
          src="/zoom-out.svg"
          alt="zoom-out"
        />
      </button>
      <!-- <div class="zoom-line"></div> -->
      <!-- <button
        class="zoom-btn"
        @click="fitMarkersToViewport"
        title="Fit all markers to view"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3H7V7H3V3Z"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 3H21V7H17V3Z"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3 17H7V21H3V17Z"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 17H21V21H17V17Z"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
// import CustomMarker from "@/components/CustomMarker.vue";

const props = defineProps({
  locationList: {
    type: Array,
    default: () => [],
  },
  mapImgSource: {
    type: String,
    default: () => "./map.webp",
  },
  minZoom: {
    type: Number,
    default: 1,
  },
  maxZoom: {
    type: Number,
    default: 3,
  },
  zoomStep: {
    type: Number,
    default: 0.2,
  },
  initialZoom: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["markerClick"]);

const containerRef = ref(null);
const mapWrapperRef = ref(null);

const zoomLevel = ref(props.initialZoom);
const panX = ref(0);
const panY = ref(0);

// Add reactive array to store click positions
const clickPositions = ref([]);

const isPanning = ref(false);
const startPanX = ref(0);
const startPanY = ref(0);
const startMouseX = ref(0);
const startMouseY = ref(0);

// Track container dimensions for reactive positioning
const containerDimensions = ref({ width: 0, height: 0 });

// Update container dimensions
const updateContainerDimensions = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    containerDimensions.value = {
      width: rect.width,
      height: rect.height,
    };
  }
};

// 4K resolution reference (3840x2160)
const REFERENCE_WIDTH = 3840;
const REFERENCE_HEIGHT = 2160;

// Function to convert 4K-based coordinates to current screen coordinates
const convertCoordinates = (coordinates) => {
  if (!coordinates || !containerDimensions.value.width) return { x: 0, y: 0 };

  const [x, y] = coordinates
    .split(",")
    .map((coord) => parseFloat(coord.trim()));
  if (isNaN(x) || isNaN(y)) return { x: 0, y: 0 };

  const currentWidth = containerDimensions.value.width;
  const currentHeight = containerDimensions.value.height;

  // Convert from 4K reference to current screen size
  const scaleX = currentWidth / REFERENCE_WIDTH;
  const scaleY = currentHeight / REFERENCE_HEIGHT;

  return {
    x: x * scaleX,
    y: y * scaleY,
  };
};

// Zoom functions
const zoomAt = (newZoom, centerX, centerY) => {
  if (newZoom !== zoomLevel.value) {
    const zoomRatio = newZoom / zoomLevel.value;
    const newPanX = centerX - (centerX - panX.value) * zoomRatio;
    const newPanY = centerY - (centerY - panY.value) * zoomRatio;

    // Apply boundary constraints after zoom
    panX.value = constrainPanX(newPanX);
    panY.value = constrainPanY(newPanY);
    zoomLevel.value = newZoom;
  }
};

const zoomIn = () => {
  if (zoomLevel.value < props.maxZoom) {
    const newZoom = Math.min(props.maxZoom, zoomLevel.value + props.zoomStep);
    // Center of the container
    const rect = containerRef.value.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    zoomAt(newZoom, centerX, centerY);
  }
};

const zoomOut = () => {
  if (zoomLevel.value > props.minZoom) {
    const newZoom = Math.max(props.minZoom, zoomLevel.value - props.zoomStep);
    // Center of the container
    const rect = containerRef.value.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    zoomAt(newZoom, centerX, centerY);
  }
};

const resetZoom = () => {
  zoomLevel.value = props.initialZoom;
  panX.value = 0;
  panY.value = 0;
};

// Pan functions
const startPan = (e) => {
  // Check if the click target is a marker or its children
  const target = e.target;
  const isMarkerClick =
    target.closest(".marker-position") !== null ||
    target.closest("[data-marker]") !== null;

  // If it's a marker click, don't start panning
  if (isMarkerClick) {
    return;
  }

  getPosition(e);
  e.preventDefault();

  isPanning.value = true;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  startMouseX.value = clientX;
  startMouseY.value = clientY;
  startPanX.value = panX.value;
  startPanY.value = panY.value;

  document.addEventListener("mousemove", onPan);
  document.addEventListener("touchmove", onPan, { passive: false });
  document.addEventListener("mouseup", stopPan);
  document.addEventListener("touchend", stopPan);
};

function getPosition(e) {
  const img = document.querySelector(".map-wrapper img");
  const rect = img.getBoundingClientRect();

  // Calculate position relative to the actual image
  const xRelative = e.touches ? e.touches[0].clientX : e.clientX;
  const yRelative = e.touches ? e.touches[0].clientY : e.clientY;

  // Account for current pan and zoom transformations
  // The image is transformed by the map-wrapper, so we need to reverse those transformations
  const xPx = (xRelative - panX.value) / zoomLevel.value;
  const yPx = (yRelative - panY.value) / zoomLevel.value;

  console.log("Bạn vừa bấm vào:", xPx.toFixed(2), yPx.toFixed(2));

  // Add click position to the array
  clickPositions.value.push({
    x: xPx,
    y: yPx,
    id: Date.now(), // Use timestamp as unique ID
  });
}

const onPan = (e) => {
  if (!isPanning.value) return;

  // Check if the original click was on a marker
  const target = e.target;
  const isMarkerClick =
    target.closest(".marker-position") !== null ||
    target.closest("[data-marker]") !== null;

  // If we're panning over a marker, stop panning
  if (isMarkerClick) {
    stopPan();
    return;
  }

  e.preventDefault();

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const deltaX = clientX - startMouseX.value;
  const deltaY = clientY - startMouseY.value;

  const newPanX = startPanX.value + deltaX;
  const newPanY = startPanY.value + deltaY;

  // Apply boundary constraints
  const constrainedPanX = constrainPanX(newPanX);
  const constrainedPanY = constrainPanY(newPanY);

  panX.value = constrainedPanX;
  panY.value = constrainedPanY;
};

// Boundary constraint functions
// Utility to get rendered map size based on container width, image aspect ratio, and zoom
const getRenderedMapSize = () => {
  const container = containerRef.value;
  const mapWrapper = mapWrapperRef.value;
  if (!container || !mapWrapper) return { width: 0, height: 0 };
  const mapImage = mapWrapper.querySelector(".map-image");
  if (!mapImage || !mapImage.naturalWidth || !mapImage.naturalHeight)
    return { width: 0, height: 0 };
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const aspectRatio = mapImage.naturalHeight / mapImage.naturalWidth;
  const width = containerWidth * zoomLevel.value;
  const height = containerWidth * aspectRatio * zoomLevel.value;
  return { width, height };
};

const constrainPanX = (panX) => {
  if (!containerRef.value) return panX;
  const container = containerRef.value;
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const { width: mapWidth } = getRenderedMapSize();
  if (mapWidth <= containerWidth) {
    return (containerWidth - mapWidth) / 2;
  }
  const maxPanX = 0;
  const minPanX = containerWidth - mapWidth;
  return Math.max(minPanX, Math.min(maxPanX, panX));
};

const constrainPanY = (panY) => {
  if (!containerRef.value) return panY;
  const container = containerRef.value;
  const containerRect = container.getBoundingClientRect();
  const containerHeight = containerRect.height;
  const { height: mapHeight } = getRenderedMapSize();
  if (mapHeight <= containerHeight) {
    return (containerHeight - mapHeight) / 2;
  }
  const maxPanY = 0;
  const minPanY = containerHeight - mapHeight;
  return Math.max(minPanY, Math.min(maxPanY, panY));
};

const stopPan = () => {
  isPanning.value = false;
  document.removeEventListener("mousemove", onPan);
  document.removeEventListener("touchmove", onPan);
  document.removeEventListener("mouseup", stopPan);
  document.removeEventListener("touchend", stopPan);
};

// Wheel zoom
const handleWheel = (e) => {
  e.preventDefault();

  const delta = e.deltaY > 0 ? -props.zoomStep : props.zoomStep;
  const newZoom = Math.max(
    props.minZoom,
    Math.min(props.maxZoom, zoomLevel.value + delta)
  );

  if (newZoom !== zoomLevel.value) {
    // Calculate zoom center point
    const rect = containerRef.value.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;

    // Adjust pan to keep zoom center
    const zoomRatio = newZoom / zoomLevel.value;
    const newPanX = centerX - (centerX - panX.value) * zoomRatio;
    const newPanY = centerY - (centerY - panY.value) * zoomRatio;

    // Apply boundary constraints after zoom
    panX.value = constrainPanX(newPanX);
    panY.value = constrainPanY(newPanY);
    zoomLevel.value = newZoom;
  }
};

// Fit markers to viewport
const fitMarkersToViewport = () => {
  if (!props.locationList?.length || !containerDimensions.value.width) return;

  // Handle single marker case
  if (props.locationList.length === 1) {
    const position = props.locationList[0];
    // Us if present, fallback to coordinates
    const coords = position?.coordinates || position?.coordinates;
    if (!coords) return;

    const convertedCoords = convertCoordinates(coords);
    if (convertedCoords.x === 0 && convertedCoords.y === 0) return;

    const containerWidth = containerDimensions.value.width;
    const containerHeight = containerDimensions.value.height;

    // Center the marker in the viewport at maxZoom
    const zoom = props.maxZoom;
    zoomLevel.value = zoom;
    // Use converted coordinates
    const targetX = convertedCoords.x;
    const targetY = convertedCoords.y;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    panX.value = constrainPanX(centerX - targetX * zoom);
    panY.value = constrainPanY(centerY - targetY * zoom);

    // Add transition for smooth animation
    const mapWrapper = mapWrapperRef.value;
    if (mapWrapper) {
      mapWrapper.style.transition = "transform 0.8s ease-out";
    }
    setTimeout(() => {
      if (mapWrapper) {
        mapWrapper.style.transition = "transform 0.1s ease-out";
      }
    }, 800);
    return;
  }

  const containerWidth = containerDimensions.value.width;
  const containerHeight = containerDimensions.value.height;

  // Calculate bounding box of all markers using converted coordinates
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  props.locationList.forEach((location) => {
    const coords = location?.coordinates || location?.coordinates;
    if (coords) {
      const convertedCoords = convertCoordinates(coords);
      if (convertedCoords.x !== 0 || convertedCoords.y !== 0) {
        minX = Math.min(minX, convertedCoords.x);
        maxX = Math.max(maxX, convertedCoords.x);
        minY = Math.min(minY, convertedCoords.y);
        maxY = Math.max(maxY, convertedCoords.y);
      }
    }
  });

  // Check if we have valid bounds
  if (
    minX === Infinity ||
    maxX === -Infinity ||
    minY === Infinity ||
    maxY === -Infinity
  ) {
    return;
  }

  // Add padding around the markers (10% on each side)
  const padding = 0.1;
  const markerWidth = maxX - minX;
  const markerHeight = maxY - minY;

  const paddedWidth = markerWidth + markerWidth * padding * 2;
  const paddedHeight = markerHeight + markerHeight * padding * 2;

  // Calculate the scale needed to fit all markers
  const scaleX = containerWidth / paddedWidth;
  const scaleY = containerHeight / paddedHeight;

  // Use the smaller scale to ensure all markers fit
  const newZoom = Math.min(scaleX, scaleY, props.maxZoom);

  // Calculate center of all markers
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const containerCenterX = containerWidth / 2;
  const containerCenterY = containerHeight / 2;

  // Calculate pan to center the markers
  const newPanX = containerCenterX - centerX * newZoom;
  const newPanY = containerCenterY - centerY * newZoom;

  // Add transition for smooth animation
  const mapWrapper = mapWrapperRef.value;
  if (mapWrapper) {
    mapWrapper.style.transition = "transform 0.8s ease-out";
  }

  // Apply the new zoom and pan
  zoomLevel.value = Math.max(newZoom, props.minZoom);
  panX.value = constrainPanX(newPanX);
  panY.value = constrainPanY(newPanY);
  // Reset transition after animation
  setTimeout(() => {
    if (mapWrapper) {
      mapWrapper.style.transition = "transform 0.1s ease-out";
    }
  }, 800);
};

// Zoom to specific marker
const zoomToMarker = (position) => {
  if (!containerDimensions.value.width) return;

  // Get coordinates fro or fallback to coordinates
  const coords = position?.coordinates || position?.coordinates;
  if (!coords) return;

  const convertedCoords = convertCoordinates(coords);
  if (convertedCoords.x === 0 && convertedCoords.y === 0) return;

  // Use reactive container dimensions
  const containerWidth = containerDimensions.value.width;
  const containerHeight = containerDimensions.value.height;

  // Use converted coordinates
  const targetX = convertedCoords.x;
  const targetY = convertedCoords.y;

  // Calculate center of container
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Set zoom first
  zoomLevel.value = props.maxZoom;

  // Calculate pan to center the marker
  panX.value = constrainPanX(centerX - targetX * props.maxZoom);
  panY.value = constrainPanY(centerY - targetY * props.maxZoom);

  // Add transition
  const mapWrapper = mapWrapperRef.value;
  mapWrapper.style.transition = "transform 0.4s ease-in-out";
  setTimeout(() => {
    mapWrapper.style.transition = "transform 0.1s ease-out";
  }, 400);
};

// Keyboard controls
const handleKeydown = (e) => {
  switch (e.key) {
    case "+":
    case "=":
      e.preventDefault();
      zoomIn();
      break;
    case "-":
      e.preventDefault();
      zoomOut();
      break;
    case "0":
      e.preventDefault();
      resetZoom();
      break;
  }
};

function runFitMarkersWhenImageReady() {
  nextTick(() => {
    const mapWrapper = mapWrapperRef.value;
    if (!mapWrapper) return;
    const mapImage = mapWrapper.querySelector(".map-image");
    if (!mapImage) return;
    if (mapImage.complete) {
      fitMarkersToViewport();
    } else {
      mapImage.addEventListener("load", fitMarkersToViewport, { once: true });
    }
  });
}

// Watch for changes in locationList and fit markers to viewport
watch(
  () => props.locationList,
  (newLocations) => {
    if (newLocations.length > 0) {
      runFitMarkersWhenImageReady();
    }
  },
  { immediate: false }
);

// Watch for window resize to recalculate positions
const handleResize = () => {
  // Update container dimensions
  updateContainerDimensions();

  // Force a re-render of markers by triggering a reactive update
  nextTick(() => {
    if (props.locationList.length > 0) {
      // Small delay to ensure container dimensions are updated
      setTimeout(() => {
        fitMarkersToViewport();
      }, 100);
    }
  });
};

function onMarkerClick(position) {
  // Stop event propagation to prevent pan from interfering
  event?.stopPropagation();
  fitMarkersToViewport();

  emit("markerClick", position);
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);

  // Initialize container dimensions
  nextTick(() => {
    updateContainerDimensions();
    if (props.locationList.length > 0) {
      runFitMarkersWhenImageReady();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", handleResize);
  stopPan();
});

// Expose methods for parent components
defineExpose({
  zoomIn,
  zoomOut,
  resetZoom,
  zoomLevel: computed(() => zoomLevel.value),
  zoomToMarker,
  fitMarkersToViewport,
});
</script>

<style lang="scss" scoped>
.map-zoom-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.map-wrapper {
  width: 100%;
  height: auto;
  transition: transform 0.1s ease-out;
  // will-change: transform;

  .map-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    pointer-events: none;
    user-drag: none;
    user-select: none;
    // transform: translate(-20rem, -20rem);
  }

  .marker-position {
    cursor: pointer;
    width: 35.5rem;
    height: 15rem;
    z-index: 15;
    transition: all 0.3s ease;

    &.flipped-marker {
      transform: translate(-50%, 0%) scaleY(-1);

      :deep(.marker-wrapper) {
        .marker-btn {
          transform: scaleY(-1) translate(-50%, 50%);
          top: 5%;
        }
        .marker-thumbnail {
          transform: scaleY(-1);
        }
        h3 {
          top: 55%;
          transform: scaleY(-1) translate(-50%, 0%);
        }
      }
    }
  }

  .click-marker {
    width: 5rem;
    height: 5rem;
    background-color: blue;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 20;
    pointer-events: none;
  }
}

.zoom-controls {
  position: absolute;
  bottom: 3rem;
  right: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  z-index: 10;
  background-color: #ffdbc8;
  padding: 2.32rem;
  border-radius: 1.33rem;

  .zoom-line {
    width: 100%;
    height: 1px;
    background-color: #000;
  }
  .zoom-btn {
    width: 4rem;
    height: 4rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// Custom scrollbar for the map container
.map-zoom-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.map-zoom-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
