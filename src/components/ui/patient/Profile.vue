<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center pt-4">
    <h1 class="text-3xl font-bold mb-6 text-teal-500">Patient Profile</h1>
    <div class="w-full max-w-2xl grid grid-cols-1 gap-4">
      <div
        v-for="(value, key) in patientDetails"
        :key="key"
        class="bg-white p-4 rounded-lg shadow-md"
      >
        <h2 class="text-teal-500 font-semibold capitalize">{{ key }}</h2>
        <p class="mt-2">{{ value || "N/A" }}</p>
      </div>

      <div v-if="patient.emergencyContact?.length" class="col-span-1">
        <h2 class="text-xl font-semibold mt-4 text-teal-500">
          Emergency Contacts
        </h2>
        <ul class="space-y-2 mt-2">
          <li
            v-for="(contact, index) in patient.emergencyContact"
            :key="index"
            class="bg-white p-4 rounded-lg shadow-md"
          >
            <p><strong>Name:</strong> {{ contact.name }}</p>
            <p><strong>Phone Number:</strong> {{ contact.phoneNumber }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePatientStore } from "@/stores/patient";
import { computed } from "vue";

const patientStore = usePatientStore();
const patient = patientStore.getPatient;

const patientDetails = computed(() => ({
  Name: patient.name,
  Email: patient.email,
  "Phone Number": patient.phoneNumber,
  "Date of Birth": patient.dateOfBirth,
  Gender: patient.gender,
  Address: patient.address,
  "Medical History": patient.medicalHistory?.join(", "),
  Allergies: patient.allergies?.join(", "),
  "Chronic Conditions": patient.chronicConditions?.join(", "),
}));
</script>

<style scoped></style>
