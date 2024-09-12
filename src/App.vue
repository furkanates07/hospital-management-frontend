<template>
  <div :class="getContainerClasses">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const getContainerClasses = computed(() => {
  return route.path !== "/login" ? "h-screen overflow-y-scroll" : "";
});
</script>

<style></style>
