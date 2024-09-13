<template>
  <div v-if="contacts.length">
    <h2 class="text-xl font-semibold mt-4 text-teal-500">Emergency Contacts</h2>
    <ul class="space-y-2 mt-2">
      <li
        v-for="(contact, index) in contacts"
        :key="index"
        class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-4 border-teal-500"
      >
        <div>
          <p><strong>Name:</strong> {{ contact.name }}</p>
          <p>
            <strong>Phone Number:</strong>
            {{ formatPhoneNumber(contact.phoneNumber) }}
          </p>
        </div>
        <div v-if="isEditing">
          <button
            @click="onDelete(index)"
            class="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 ml-2"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { EmergencyContact } from "@/interfaces";
import { defineEmits, defineProps } from "vue";

const props = defineProps<{
  contacts: EmergencyContact[];
  isEditing: boolean;
}>();

const emit = defineEmits<{
  (event: "delete-contact", index: number): void;
}>();

const onDelete = (index: number) => {
  emit("delete-contact", index);
};

const formatPhoneNumber = (phoneNumber: string): string => {
  const rawNumber = phoneNumber.replace(/\s+/g, "");
  return rawNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
};
</script>
