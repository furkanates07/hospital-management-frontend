<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div class="w-full max-w-2xl relative">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-teal-500">Appointments</h1>
      </div>

      <div class="py-4">
        <div
          v-if="appointments.length"
          v-for="appointment in appointments"
          :key="appointment.date.day + appointment.date.hour"
          class="bg-white p-4 rounded-lg shadow-md mt-4"
        >
          <h2 class="text-teal-500 font-semibold mb-2">
            Appointment with Doctor:
            {{ getDoctorName(appointment.doctorId) }}
          </h2>
          <p><strong>Date:</strong> {{ formatDate(appointment.date) }}</p>
          <p><strong>Status:</strong> {{ appointment.status }}</p>
          <p><strong>Reason:</strong> {{ appointment.reason }}</p>
          <p v-if="appointment.prescription">
            <strong>Prescription:</strong> {{ appointment.prescription }}
          </p>
        </div>
        <p v-else class="text-gray-600">No appointments available.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDoctorStore } from "@/stores/doctor";
import { usePatientStore } from "@/stores/patient";
import { computed, onMounted } from "vue";

const patientStore = usePatientStore();
const doctorStore = useDoctorStore();

onMounted(async () => {
  await patientStore.fetchAppointments(patientStore.userID);
});

const appointments = computed(() => patientStore.getAppointments);

const formatDate = (date: { day: string; hour: string }) => {
  return `${date.day} at ${date.hour}`;
};

const getDoctorName = async (doctorId: string) => {
  console.log(doctorStore.fetchDoctorNamebyID(doctorId));
};
</script>

<style scoped></style>
