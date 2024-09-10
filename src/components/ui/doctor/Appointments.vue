<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div class="w-full max-w-2xl relative">
      <!-- Header -->
      <div class="flex flex-row justify-between">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-teal-500">Appointments</h1>
        </div>
      </div>

      <!-- Status Filter Buttons -->
      <div class="pt-4 flex space-x-4">
        <button
          v-for="stat in ['All', ...status]"
          :key="stat"
          @click="selectedStatus = stat === 'All' ? '' : stat"
          :class="{
            'bg-teal-500 text-white':
              selectedStatus === stat || (stat === 'All' && !selectedStatus),
            'bg-gray-200 text-gray-700':
              selectedStatus !== stat && !(stat === 'All' && !selectedStatus),
          }"
          class="py-2 px-4 rounded-lg text-sm shadow-md transition-colors"
        >
          {{ stat.toUpperCase() }}
        </button>
      </div>

      <!-- Appointments List -->
      <div class="py-4">
        <div
          v-if="filteredAppointments.length"
          v-for="appointment in filteredAppointments"
          :key="appointment.slot.date + appointment.slot.hour"
          class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4"
          :style="{
            borderColor: getStatusColor(appointment.status),
          }"
        >
          <div class="flex flex-row justify-between">
            <h2 class="text-teal-500 font-semibold mb-2">
              Appointment with Patient:
              {{ patientNames[appointment.patientId] || "Loading..." }}
            </h2>
            <div
              v-if="appointment.status === Status.PENDING"
              class="flex space-x-2"
            >
              <button
                @click="approveAppointment(appointment)"
                class="text-green-500 cursor-pointer"
              >
                <span class="material-symbols-outlined"> check </span>
              </button>
              <button
                @click="rejectAppointment(appointment)"
                class="text-red-500 cursor-pointer"
              >
                <span class="material-symbols-outlined"> close </span>
              </button>
            </div>
            <div
              v-if="appointment.status === Status.APPROVED"
              class="flex space-x-2"
            >
              <router-link to="/examination">
                <button
                  @click="completeAppointment(appointment)"
                  class="text-blue-500 cursor-pointer"
                >
                  <span class="material-symbols-outlined"> check_circle </span>
                </button>
              </router-link>
            </div>
          </div>

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
            v-if="
              appointment.prescription &&
              appointment.status === Status.COMPLETED
            "
            class="text-gray-700 mb-2"
          >
            <strong>Prescription:</strong> {{ appointment.prescription }}
          </p>
        </div>
        <p v-else class="text-gray-600">No appointments available.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Status } from "@/enums/status.enum";
import { Appointment } from "@/interfaces/appointment";
import { useAppointmentStore } from "@/stores/appointment";
import { useDoctorStore } from "@/stores/doctor";
import { usePatientStore } from "@/stores/patient";
import { computed, onMounted, ref } from "vue";

const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();
const patientStore = usePatientStore();

const patientNames = ref<Record<string, string>>({});
const selectedAppointment = ref<Appointment | null>(null);
const selectedStatus = ref<string>("");
const selectedAppointmentId = ref<string>("");

const status = Object.values(Status);

onMounted(async () => {
  await doctorStore.fetchAppointments(doctorStore.userID);
  await fetchPatientData();
});

const appointments = computed(() => {
  return doctorStore.getAppointments.slice().sort((a, b) => {
    const dateA = new Date(a.slot.date).getTime();
    const dateB = new Date(b.slot.date).getTime();
    return dateA - dateB;
  });
});

const filteredAppointments = computed(() => {
  const today = new Date().setHours(0, 0, 0, 0);

  if (!selectedStatus.value) {
    return appointments.value.filter((appointment) => {
      const appointmentDate = new Date(appointment.slot.date).getTime();
      return appointmentDate >= today;
    });
  }

  return appointments.value.filter((appointment) => {
    return appointment.status === selectedStatus.value;
  });
});

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

const fetchPatientData = async () => {
  const appointmentPatients = appointments.value.map((a) => a.patientId);
  for (const patientId of new Set(appointmentPatients)) {
    await patientStore.fetchPatient(patientId);
    patientNames.value[patientId] = patientStore.getPatientFullName;
  }
};

const approveAppointment = async (appointment: Appointment) => {
  selectedAppointment.value = appointment;

  if (selectedAppointment.value.status === Status.PENDING) {
    await appointmentStore.getAppointmentIdByPatientIdAndDoctorId(
      appointment.patientId,
      appointment.doctorId
    );

    selectedAppointmentId.value = appointmentStore.getAppointmentID;

    await appointmentStore.approveAppointment(selectedAppointmentId.value);
    await doctorStore.fetchAppointments(doctorStore.userID);
  }
  fetchPatientData();
};

const rejectAppointment = async (appointment: Appointment) => {
  selectedAppointment.value = appointment;

  if (selectedAppointment.value.status === Status.PENDING) {
    await appointmentStore.getAppointmentIdByPatientIdAndDoctorId(
      appointment.patientId,
      appointment.doctorId
    );

    selectedAppointmentId.value = appointmentStore.getAppointmentID;

    await appointmentStore.rejectAppointment(selectedAppointmentId.value);
    await doctorStore.fetchAppointments(doctorStore.userID);
  }
  fetchPatientData();
};

const completeAppointment = async (appointment: Appointment) => {
  selectedAppointment.value = appointment;

  if (selectedAppointment.value.status === Status.APPROVED) {
    await appointmentStore.getAppointmentIdByPatientIdAndDoctorId(
      appointment.patientId,
      appointment.doctorId
    );

    selectedAppointmentId.value = appointmentStore.getAppointmentID;

    await appointmentStore.fetchAppointment(selectedAppointmentId.value);
  }
  fetchPatientData();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case Status.PENDING:
      return "yellow-500";
    case Status.APPROVED:
      return "blue-500";
    case Status.REJECTED:
      return "red-500";
    case Status.CANCELED:
      return "gray-500";
    case Status.COMPLETED:
      return "green-500";
    default:
      return "gray-500";
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case Status.PENDING:
      return "text-yellow-500";
    case Status.APPROVED:
      return "text-blue-500";
    case Status.REJECTED:
      return "text-red-500";
    case Status.CANCELED:
      return "text-gray-500";
    case Status.COMPLETED:
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};
</script>

<style scoped></style>
