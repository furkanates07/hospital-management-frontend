<template>
  <div class="flex space-x-4 mb-4">
    <button
      @click="emit('changeTab', 'profile')"
      :class="{
        'text-teal-500 border-b-2 border-teal-500': activeTab === 'profile',
        'text-gray-600': activeTab !== 'profile',
      }"
      class="py-2 px-4 font-semibold"
    >
      Details
    </button>
    <button
      @click="emit('changeTab', 'contacts')"
      :class="{
        'text-teal-500 border-b-2 border-teal-500': activeTab === 'contacts',
        'text-gray-600': activeTab !== 'contacts',
      }"
      class="py-2 px-4 font-semibold"
    >
      Emergency Contacts
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

const props = defineProps<{
  activeTab: "profile" | "contacts";
}>();

const emit = defineEmits<{
  (event: "changeTab", tab: "profile" | "contacts"): void;
}>();
</script>
