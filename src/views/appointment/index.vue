<template>
  <div class="grid grid-cols-6 min-h-screen bg-teal-600">
    <!-- Sidebar -->
    <div class="col-span-1 bg-teal-500 p-4">
      <h2 class="text-white text-xl font-bold mb-4 flex justify-center">
        Specialties
      </h2>
      <ul class="space-y-2">
        <li
          v-for="speciality in specialities"
          :key="speciality"
          @click="selectSpeciality(speciality)"
          class="cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-teal-400"
          :class="{ 'bg-teal-400': speciality === selectedSpeciality }"
        >
          {{ speciality }}
        </li>
      </ul>
    </div>

    <!-- Main content -->
    <div
      class="col-span-5 bg-gray-100 min-h-screen flex flex-col items-center py-4"
    >
      <div class="w-full max-w-2xl relative">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-teal-600">Doctors</h1>
        </div>

        <div class="py-4">
          <div v-if="selectedSpeciality || doctors.length > 0">
            <div
              v-for="doctor in doctors"
              :key="doctor.email"
              class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-teal-500"
            >
              <p class="font-semibold text-teal-500">
                {{ doctor.name || "N/A" }}
              </p>
              <p class="text-gray-700">{{ doctor.title || "N/A" }}</p>
              <p class="text-gray-500">{{ doctor.speciality || "N/A" }}</p>
            </div>
          </div>
          <p v-if="doctors.length === 0" class="text-gray-500 mt-4">
            Select a specialty to see doctors or wait for the list to load.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Speciality } from "@/enums";
import { Doctor } from "@/interfaces";
import { useDoctorsStore } from "@/stores/doctors";
import { onMounted, ref, watch } from "vue";

const doctorsStore = useDoctorsStore();
const doctors = ref<Doctor[]>([]);
const specialities = Object.values(Speciality);
const selectedSpeciality = ref<Speciality | null>(null);

const fetchDoctors = async () => {
  await doctorsStore.fetchDoctors();
  doctors.value = doctorsStore.getDoctors;
  console.log(doctors.value);
};

const fetchDoctorsBySpeciality = async (speciality: Speciality) => {
  await doctorsStore.fetchDoctorsBySpeciality(speciality);
  doctors.value = doctorsStore.getDoctors;
};

const selectSpeciality = async (speciality: Speciality) => {
  selectedSpeciality.value = speciality;
  await fetchDoctorsBySpeciality(speciality);
};

onMounted(async () => {
  await fetchDoctors();
});

watch(selectedSpeciality, (newSpeciality) => {
  if (newSpeciality) {
    fetchDoctorsBySpeciality(newSpeciality);
  } else {
    fetchDoctors();
  }
});
</script>

<style scoped></style>
