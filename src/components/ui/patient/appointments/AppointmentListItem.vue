<template>
  <div
    class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4"
    :style="{ borderColor: getStatusColor(appointment.status) }"
  >
    <div class="flex flex-row justify-between">
      <h2 class="text-teal-500 font-semibold mb-2">
        Appointment with Doctor:
        {{ doctorNames[appointment.doctorId] || "Loading..." }}
      </h2>
      <button
        v-if="isCancellable(appointment.status)"
        @click="onCancel"
        class="text-red-500 cursor-pointer"
      >
        <span class="material-symbols-outlined"> close </span>
      </button>
    </div>
    <p class="text-gray-700 mb-2">
      <strong>Doctor's Department:</strong>
      {{ doctorSpecialities[appointment.doctorId] || "Loading..." }}
    </p>
    <p class="text-gray-700 mb-2">
      <strong>Date:</strong> {{ formatDate(appointment.slot) }}
    </p>
    <p class="text-gray-700 mb-2">
      <strong>Status: </strong>
      <span :class="getStatusClass(appointment.status)">
        {{ appointment.status.toUpperCase() }}
      </span>
    </p>
    <p class="text-gray-700 mb-2">
      <strong>Reason:</strong> {{ appointment.reason }}
    </p>
    <p
      v-if="appointment.prescription && appointment.status === Status.COMPLETED"
      class="text-gray-700 mb-2"
    >
      <strong>Prescription:</strong> {{ appointment.prescription }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Status } from "@/enums/status.enum";
import { Appointment } from "@/interfaces/appointment";

const props = defineProps<{
  appointment: Appointment;
  doctorNames: Record<string, string>;
  doctorSpecialities: Record<string, string>;
}>();

const emit = defineEmits<{
  (event: "cancel-appointment", appointment: Appointment): void;
}>();

const isCancellable = (status: string) =>
  [Status.PENDING, Status.APPROVED].includes(status as Status);

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

const getStatusProperties = (status: string) => {
  const statusMap: Record<string, { color: string; textClass: string }> = {
    [Status.PENDING]: { color: "yellow-500", textClass: "text-yellow-500" },
    [Status.APPROVED]: { color: "blue-500", textClass: "text-blue-500" },
    [Status.REJECTED]: { color: "red-500", textClass: "text-red-500" },
    [Status.CANCELED]: { color: "gray-500", textClass: "text-gray-500" },
    [Status.COMPLETED]: { color: "green-500", textClass: "text-green-500" },
  };
  return statusMap[status] || { color: "gray-500", textClass: "text-gray-500" };
};

const getStatusColor = (status: string) => getStatusProperties(status).color;
const getStatusClass = (status: string) =>
  getStatusProperties(status).textClass;

const onCancel = () => {
  emit("cancel-appointment", props.appointment);
};
</script>
