<template>
  <div class="flex h-screen bg-gray-100">
    <div class="w-80 bg-white shadow-lg p-6 overflow-y-auto z-10">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Image Tool</h2>
      
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Upload Image
        </label>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image Width: {{ imageWidth }}px
        </label>
        <input
          type="range"
          min="50"
          max="4000"
          v-model.number="imageWidth"
          class="w-full"
        />
        <input
          type="number"
          v-model.number="imageWidth"
          class="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image Height: {{ imageHeight }}px
        </label>
        <input
          type="range"
          min="50"
          max="4000"
          v-model.number="imageHeight"
          class="w-full"
        />
        <input
          type="number"
          v-model.number="imageHeight"
          class="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Container Width: {{ containerWidth }}px
        </label>
        <input
          type="range"
          min="200"
          max="4000"
          v-model.number="containerWidth"
          class="w-full"
        />
        <input
          type="number"
          v-model.number="containerWidth"
          class="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Container Height: {{ containerHeight }}px
        </label>
        <input
          type="range"
          min="200"
          max="4000"
          v-model.number="containerHeight"
          class="w-full"
        />
        <input
          type="number"
          v-model.number="containerHeight"
          class="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image X Position: {{ imageX }}px
        </label>
        <input
          type="range"
          min="-500"
          max="4000"
          v-model.number="imageX"
          class="w-full"
        />
        <input
          type="number"
          v-model.number="imageX"
          class="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image Y Position: {{ imageY }}px
        </label>
        <input
          type="range"
          min="-500"
          max="4000"
          v-model.number="imageY"
          class="w-full"
        />
        <input
          type="number"
          v-model.number="imageY"
          class="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex-1 overflow-auto p-8 flex items-start justify-center bg-gray-200">
      <div
        ref="containerRef"
        class="bg-white border-2 border-gray-300 relative overflow-hidden shadow-xl cursor-crosshair flex-shrink-0"
        :style="{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`
        }"
        @click="handleImageClick"
      >
        <img
          v-if="image"
          :src="image"
          alt="Uploaded"
          class="absolute object-cover pointer-events-none"
          :style="{
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            left: `${imageX}px`,
            top: `${imageY}px`
          }"
        />
        <div v-else class="flex items-center justify-center h-full text-gray-400">
          <p>Upload an image to get started</p>
        </div>
      </div>
    </div>

    <div
      v-if="showPopup && clickedCoords"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-2xl p-6 min-w-[300px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">Coordinates</h3>
          <button
            @click="showPopup = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="mb-4 p-4 bg-gray-100 rounded">
          <p class="text-lg font-mono text-gray-700">
            X: <span class="font-bold text-blue-600">{{ clickedCoords.x }}</span>
          </p>
          <p class="text-lg font-mono text-gray-700">
            Y: <span class="font-bold text-blue-600">{{ clickedCoords.y }}</span>
          </p>
        </div>

        <button
          @click="copyCoordinates"
          class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          {{ copied ? 'Copied!' : 'Copy Coordinates' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageTool',
  data() {
    return {
      image: null,
      imageWidth: 651,
      imageHeight: 879,
      containerWidth: 1080,
      containerHeight: 1920,
      imageX: 215,
      imageY: 520,
      clickedCoords: null,
      showPopup: false,
      copied: false
    }
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleImageClick(event) {
      if (!this.image) return;
      
      const rect = event.currentTarget.getBoundingClientRect();
      const x = Math.round(event.clientX - rect.left);
      const y = Math.round(event.clientY - rect.top);
      
      this.clickedCoords = { x, y };
      this.showPopup = true;
      this.copied = false;
    },
    copyCoordinates() {
      if (this.clickedCoords) {
        const coordText = `x: ${this.clickedCoords.x}, y: ${this.clickedCoords.y}`;
        navigator.clipboard.writeText(coordText);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      }
    }
  }
}
</script>