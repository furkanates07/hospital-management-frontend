<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div class="w-full max-w-2xl relative">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-teal-500">Doctor Profile</h1>
      </div>

      <div class="py-4">
        <div
          v-for="(value, key) in doctorDetails"
          :key="key"
          class="bg-white p-4 rounded-lg shadow-md mt-4"
        >
          <h2 class="text-teal-500 font-semibold mb-2">{{ key }}</h2>
          <p>{{ value || "N/A" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDoctorStore } from "@/stores/doctor";
import { computed } from "vue";

const doctorStore = useDoctorStore();
const doctor = computed(() => doctorStore.getDoctor);

const doctorDetails = computed(() => ({
  Name: doctor.value.name,
  Email: doctor.value.email,
  Speciality: doctor.value.speciality,
  Title: doctor.value.title,
  "Years of Experience": doctor.value.yearsOfExperience,
}));
</script>

<style scoped></style>
