<template>
  <div class="app-container home">
      <img src="../assets/logo/logo2.png" @click="tohome">
  </div>
</template>

<script>
export default {

  methods: {
    tohome() {
      window.location.href = 'http://localhost:8081/';
    }
  }

};
</script>

<style scoped>
  .app-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .home img {
      animation: rotate 3s infinite linear;
      animation-iteration-count: 1
  }

  @keyframes rotate {
    0% {
      transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(0deg) rotateY(360deg) rotateZ(0deg);
    }
  }
</style>

