<template>
  <div class="py-4">
    <AppointmentListItem
      v-if="appointments.length"
      v-for="appointment in appointments"
      :key="appointment.slot.date + appointment.slot.hour"
      :appointment="appointment"
      :doctorNames="doctorNames"
      :doctorSpecialities="doctorSpecialities"
      @cancel-appointment="cancelAppointment"
    />
    <p v-else class="text-gray-600">No appointments available.</p>
  </div>
</template>

<script setup lang="ts">
import { Appointment } from "@/interfaces/appointment";
import AppointmentListItem from "./AppointmentListItem.vue";

const props = defineProps<{
  appointments: Appointment[];
  doctorNames: Record<string, string>;
  doctorSpecialities: Record<string, string>;
}>();

const emit = defineEmits<{
  (event: "cancel-appointment", appointment: Appointment): void;
}>();

const cancelAppointment = (appointment: Appointment) => {
  emit("cancel-appointment", appointment);
};
</script>
