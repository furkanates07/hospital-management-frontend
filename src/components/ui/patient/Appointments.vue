<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div class="w-full max-w-2xl relative">
      <div class="flex flex-row justify-between">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-teal-500">Appointments</h1>
        </div>
        <router-link to="/create-appointment"
          ><button
            class="bg-teal-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
          >
            CREATE
          </button></router-link
        >
      </div>

      <div class="py-4">
        <div
          v-if="appointments.length"
          v-for="appointment in appointments"
          :key="appointment.slot.date + appointment.slot.hour"
          class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-teal-500"
        >
          <h2 class="text-teal-500 font-semibold mb-2">
            Appointment with Doctor:
            {{ doctorNames[appointment.doctorId] || "Loading..." }}
          </h2>
          <p class="text-gray-700 mb-2">
            <strong>Doctor's Department:</strong>
            {{ doctorSpecialities[appointment.doctorId] || "Loading..." }}
          </p>
          <p class="text-gray-700 mb-2">
            <strong>Date:</strong> {{ formatDate(appointment.slot) }}
          </p>
          <p class="text-gray-700 mb-2">
            <strong>Status: </strong>
            <span class="text-teal-600 font-bold">
              {{ appointment.status.toUpperCase() }}
            </span>
          </p>
          <p class="text-gray-700 mb-2">
            <strong>Reason:</strong> {{ appointment.reason }}
          </p>
          <p v-if="appointment.prescription" class="text-gray-700 mb-2">
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
import { computed, onMounted, ref } from "vue";

const patientStore = usePatientStore();
const doctorStore = useDoctorStore();

const doctorNames = ref<Record<string, string>>({});
const doctorSpecialities = ref<Record<string, string>>({});

onMounted(async () => {
  await patientStore.fetchAppointments(patientStore.userID);
  fetchDoctorData();
});

const appointments = computed(() => patientStore.getAppointments);

const formatDate = (slot: { date: Date; hour: string }) => {
  const date = new Date(slot.date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return `${formattedDate} at ${slot.hour}`;
};

const fetchDoctorData = async () => {
  const appointmentDoctors = appointments.value.map((a) => a.doctorId);
  for (const doctorId of new Set(appointmentDoctors)) {
    await doctorStore.fetchDoctor(doctorId);
    doctorNames.value[doctorId] = doctorStore.getDoctorFullName;
    doctorSpecialities.value[doctorId] = doctorStore.getDoctorSpeciality;
  }
};
</script>
