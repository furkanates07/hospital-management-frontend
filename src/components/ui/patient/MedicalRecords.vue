<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div class="w-full max-w-2xl relative">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-teal-500">Medical Records</h1>
      </div>

      <div class="py-4">
        <div
          v-for="(value, key) in patientMedicalRecords"
          :key="key"
          class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-teal-500"
        >
          <h2 class="text-teal-500 font-semibold mb-2">{{ key }}</h2>
          <p>{{ value || "N/A" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePatientStore } from "@/stores/patient";
import { computed } from "vue";

const patientStore = usePatientStore();
const patient = computed(() => patientStore.getPatient);

const patientMedicalRecords = computed(() => ({
  "Medical History": patient.value.medicalHistory?.join(", ") || "",
  Allergies: patient.value.allergies?.join(", ") || "",
  "Chronic Conditions": patient.value.chronicConditions?.join(", ") || "",
}));
</script>
