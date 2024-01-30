<template>
  <div>
    <MainNavBar />
    <SecondNav />
    <router-view />
    <!-- <div id="app">
    <h1>My Vue 3 Chat App</h1>
    <ChatBot />
  </div> -->
  </div>
</template>

<script setup lang="ts">
import MainNavBar from './components/MainNavBar.vue'
import SecondNav from './components/SecondNav.vue'
// import ChatBot from './components/ChatBot.vue';
</script>

<style scoped>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  margin-bottom: 20px;
} */
</style>
