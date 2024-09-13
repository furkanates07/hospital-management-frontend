<template>
  <div v-if="!isVisible" class="flex justify-center">
    <button
      @click="showForm"
      class="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 mt-4"
    >
      Add New Contact
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (event: "start-adding-new-contact"): void;
}>();

const showForm = () => {
  emit("start-adding-new-contact");
};
</script>
