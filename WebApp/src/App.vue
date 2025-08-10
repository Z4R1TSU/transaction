<template>
  <div id="app">
    <transition name="fade-slide" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>
<style>
  html, body, #app{
    overflow: visible;
    background-color: var(--bg);
  }
</style>