<template>
  <div class="about">
    <div class="btn-list">
      <button 
        v-for="item in menuItems" 
        :key="item.id"
        @click="activeComponent = item.component"
        :class="{ active: activeComponent === item.component }"
        class="nav-button"
      >
        <span class="button-text">{{ item.title }}</span>
      </button>
    </div>
    
    <div class="content-area">
      <transition name="fade" mode="out-in">
        <component :is="activeComponent" v-if="activeComponent" />
        <div v-else class="welcome-screen">
          <h1>Khám phá Quy hoạch Hà Nội</h1>
          <p>Chọn một chủ đề để bắt đầu hành trình khám phá</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import K91 from "../components/Kiosk9/K9.1.vue";
import K92 from "../components/Kiosk9/K9.2.vue";
import K93 from "../components/Kiosk9/K9.3.vue";

const menuItems = [
  { id: 1, title: "Quy hoạch khu thành cổ", component: K91 },
  { id: 2, title: "Quy hoạch khu phố Tây", component: K92 },
  { id: 2, title: "Quy hoạch Hà Nội 1873 - 1888", component: K93 },
];

const activeComponent = ref(null);

// Optional: Set default component
onMounted(() => {
  // Uncomment to set a default component
  // activeComponent.value = 'K41';
});
</script>

<style lang="scss" scoped>
.about {
  background-color: #fff;
  width: 100vw;
  height: 100dvh;
  position: relative;
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .btn-list {
    width: 26.7%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

    .nav-button {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      padding: 1.5rem 2rem;
      margin: 0.5rem 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      text-align: left;

      .button-text {
        font-size: 4rem;
        font-weight: 500;
        line-height: 1.4;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateX(5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }

      &.active {
        background: rgba(255, 255, 255, 0.3);
        transform: translateX(10px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.4);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
      }
    }
  }

  .content-area {
    flex: 1;
    height: 100%;
    // overflow: auto;
    position: relative;

    .welcome-screen {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      text-align: center;
      padding: 2rem;

      h1 {
        font-size: 4rem;
        color: #333;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      p {
        font-size: 1.2rem;
        color: #666;
        max-width: 400px;
      }
    }
  }
}
</style>