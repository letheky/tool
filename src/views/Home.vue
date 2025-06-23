<template>
  <div class="home">
    <p>
      Xin chào bạn đã đến với trung tâm chấm vị trí
      <br />
      Bạn đang muôn chấm vị trí ở Kiosk
    </p>
    <nav>
      <ul>
        <li class="link"><router-link to="/kiosk3">Kiosk 3</router-link></li>
        <li class="link"><router-link to="/kiosk4">Kiosk 4</router-link></li>
        <li class="link"><router-link to="/kiosk8">Kiosk 8</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script setup></script>

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
      .link{
        border:1px solid #0c341c;
        border-radius: 2rem;
        padding: 1rem 2rem;
        font-size: 5rem;
        color: #0c341c;
        margin: 1rem;
        text-decoration: none;
        list-style: none;
      }
    }
  }
}
</style>
