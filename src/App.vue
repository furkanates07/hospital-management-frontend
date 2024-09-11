<template>
  <div class="h-screen overflow-y-scroll">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  console.log("App mounted");
});
</script>

<style></style>
