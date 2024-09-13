<template>
  <div class="flex justify-between items-center">
    <h1 class="text-3xl font-bold text-teal-500">Patient Profile</h1>
    <div class="flex gap-3 py-3">
      <div v-if="isEditing">
        <button
          @click="emit('save')"
          class="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
        >
          Save Changes
        </button>
      </div>
      <button
        @click="emit('toggleEditMode')"
        :class="{
          'bg-teal-500 hover:bg-teal-600': !isEditing,
          'bg-rose-700 hover:bg-rose-800': isEditing,
        }"
        class="text-white py-2 px-4 rounded-lg"
      >
        {{ isEditing ? "Cancel" : "Edit" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

const props = defineProps<{
  isEditing: boolean;
}>();

const emit = defineEmits(["save", "toggleEditMode"]);
</script>
