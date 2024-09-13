<template>
  <div v-if="activeTab === 'profile'">
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="(value, key) in patientDetails"
        :key="key"
        class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-4 border-teal-500"
      >
        <div class="flex-1">
          <h2 class="text-teal-500 font-semibold capitalize pl-2">
            {{ key }}
          </h2>
          <p v-if="!isEditing || !isEditableField(key)" class="mt-2 p-2">
            {{ value || "N/A" }}
          </p>
          <!-- Date of Birth Field -->
          <input
            v-else-if="key === 'Date of Birth'"
            v-model="editableFields[key]"
            type="date"
            class="mt-2 p-2 border border-teal-500 rounded-lg w-full"
            :max="currentDate"
          />
          <!-- Other Fields -->
          <input
            v-else
            v-model="editableFields[key]"
            type="text"
            class="mt-2 p-2 border border-teal-500 rounded-lg w-full"
            :placeholder="key"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  activeTab: "profile" | "contacts";
  patientDetails: Record<string, any>;
  editableFields: Record<string, any>;
  isEditing: boolean;
  isEditableField: (key: string) => boolean;
  currentDate: string;
}>();
</script>
