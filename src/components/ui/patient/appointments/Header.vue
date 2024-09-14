<template>
  <div class="flex flex-row justify-between">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-teal-500">Appointments</h1>
    </div>
    <router-link to="/create-appointment">
      <button
        class="bg-teal-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
      >
        CREATE
      </button>
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>
