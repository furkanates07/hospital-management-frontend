<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div
      class="bg-white p-16 rounded-lg shadow-lg w-full max-w-2xl relative text-center"
    >
      <h1 class="text-3xl font-bold text-teal-500 mb-4">
        Welcome, {{ doctorName }}!
      </h1>

      <div class="my-6 space-y-4">
        <p class="text-lg text-gray-700">
          You have
          <span class="font-bold text-teal-500">
            {{ pendingAppointments.length }}
          </span>
          pending appointments.
        </p>
        <p class="text-lg text-gray-700">
          You have
          <span class="font-bold text-teal-500">
            {{ approvedAppointments.length }}
          </span>
          approved appointments.
        </p>
      </div>

      <div class="mt-8">
        <p class="text-gray-600">
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

onMounted(async () => {
  await doctorStore.fetchAppointments(doctorStore.userID);
  doctorName.value = doctorStore.getDoctorFullName;

  pendingAppointments.value = doctorStore.getAppointments.filter(
    (appointment) => appointment.status === Status.PENDING
  );
  approvedAppointments.value = doctorStore.getAppointments.filter(
    (appointment) => appointment.status === Status.APPROVED
  );
});
</script>

<style scoped></style>
