<template>
  <div class="home">
    <p>
      Xin chào bạn đã đến với trung tâm chấm vị trí
      <br />
      Bạn đang muôn chấm vị trí ở 
    </p>
    <nav>
      <ul style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <li v-for="route in routesWithoutHome" :key="route.name"  class="link">
          <router-link :to="route.path">{{ route.name }}</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const routesWithoutHome = router.options.routes.filter(route => route.name !== 'home');

</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    font-size: 5rem;
    color: #0c341c;
    text-align: center;
    margin-bottom: 5rem;
  }
  nav{
    ul{
      overflow-y: auto;
      max-height: 80vh;
      .link{
        border:1px solid #0c341c;
        border-radius: 2rem;
        padding: 1rem 2rem;
       
        color: #0c341c;
        margin: 1rem;
        text-decoration: none;
        list-style: none;
        a{
          font-size: 2rem;
        }
      }
    }
  }
}
</style>
