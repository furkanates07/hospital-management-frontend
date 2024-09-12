<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-6">
    <div class="w-full max-w-2xl px-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-teal-500">Medical Records</h1>
      </div>

      <div>
        <div
          v-for="(value, key) in patientMedicalRecords"
          :key="key"
          class="bg-white p-6 rounded-lg shadow-md mt-4 border-l-4 border-teal-500"
        >
          <h2 class="text-teal-500 font-semibold text-lg mb-2">{{ key }}</h2>
          <p :class="{ 'text-gray-500 italic': !value }">
            {{ value || "N/A" }}
          </p>
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

const patientMedicalRecords = computed(() => {
  const patientData = patient.value;
  return {
    "Medical History": patientData.medicalHistory?.join(", ") || "N/A",
    Allergies: patientData.allergies?.join(", ") || "N/A",
    "Chronic Conditions": patientData.chronicConditions?.join(", ") || "N/A",
  };
});
</script>
