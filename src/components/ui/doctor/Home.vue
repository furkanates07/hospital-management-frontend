<template>
  <div class="min-h-screen bg-gray-200 flex items-center justify-center">
    <div v-if="isLoading" class="text-gray-600">Loading...</div>
    <div
      v-else
      class="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative text-center"
    >
      <h1 class="text-2xl font-semibold text-teal-600 mb-4">
        Welcome, {{ doctorName }}!
      </h1>

      <div class="my-6 space-y-3">
        <p class="text-md text-gray-800">
          You have
          <span class="font-semibold text-teal-600">
            {{ pendingAppointments.length }}
          </span>
          pending appointments.
        </p>
        <p class="text-md text-gray-800">
          You have
          <span class="font-semibold text-teal-600">
            {{ approvedAppointments.length }}
          </span>
          approved appointments.
        </p>
      </div>

      <div class="mt-6">
        <p class="text-gray-700">
          Use the menu on the left to view more details about your appointments.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Status } from "@/enums/status.enum";
import { Appointment } from "@/interfaces/appointment";
import { useDoctorStore } from "@/stores/doctor";
import { onMounted, ref } from "vue";

const doctorStore = useDoctorStore();

const pendingAppointments = ref<Appointment[]>([]);
const approvedAppointments = ref<Appointment[]>([]);
const doctorName = ref<string>("");
const isLoading = ref<boolean>(true);

function computeAppointments() {
  const allAppointments = doctorStore.getAppointments;
  pendingAppointments.value = allAppointments.filter(
    (appointment) => appointment.status === Status.PENDING
  );
  approvedAppointments.value = allAppointments.filter(
    (appointment) => appointment.status === Status.APPROVED
  );
}

onMounted(async () => {
  try {
    await doctorStore.fetchAppointments(doctorStore.userID);
    doctorName.value = doctorStore.getDoctorFullName;
    computeAppointments();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped></style>
