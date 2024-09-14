<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div v-if="loading" class="text-gray-600">Loading...</div>
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
                @click="handleAppointmentStatus(appointment, 'approve')"
                class="text-green-500 cursor-pointer"
              >
                <span class="material-symbols-outlined"> check </span>
              </button>
              <button
                @click="handleAppointmentStatus(appointment, 'reject')"
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
                  @click="handleAppointmentStatus(appointment, 'complete')"
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
import { useAuthStore } from "@/stores/auth";
import { useDoctorStore } from "@/stores/doctor";
import { usePatientStore } from "@/stores/patient";
import { computed, onMounted, ref } from "vue";

const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();
const patientStore = usePatientStore();
const user = useAuthStore();

const patientNames = ref<Record<string, string>>({});
const selectedStatus = ref<string>("");
const loading = ref<boolean>(true);

const status = Object.values(Status);

onMounted(async () => {
  try {
    await doctorStore.fetchAppointments(doctorStore.userID);
    await fetchPatientData();
  } finally {
    loading.value = false;
  }
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

  let filtered = appointments.value.filter((appointment) => {
    const appointmentDate = new Date(appointment.slot.date).getTime();
    return appointmentDate >= today;
  });

  if (selectedStatus.value && selectedStatus.value !== "All") {
    filtered = filtered.filter(
      (appointment) => appointment.status === selectedStatus.value
    );
  }

  return filtered.sort((a, b) => {
    const priorityOrder = [
      Status.PENDING,
      Status.APPROVED,
      Status.REJECTED,
      Status.CANCELED,
      Status.COMPLETED,
    ];
    const priorityA = priorityOrder.indexOf(a.status);
    const priorityB = priorityOrder.indexOf(b.status);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const dateA = new Date(a.slot.date).getTime();
    const dateB = new Date(b.slot.date).getTime();
    return dateA - dateB;
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
  try {
    const appointmentPatients = appointments.value.map((a) => a.patientId);
    for (const patientId of new Set(appointmentPatients)) {
      await patientStore.fetchPatient(patientId);
      patientNames.value[patientId] = patientStore.getPatientFullName;
    }
  } catch (error) {
    console.error("Failed to fetch patient data:", error);
  }
};

const handleAppointmentStatus = async (
  appointment: Appointment,
  action: "approve" | "reject" | "complete"
) => {
  appointmentStore.setAppointment(appointment);

  await appointmentStore.getAppointmentIdByPatientIdAndDoctorId(
    appointment.patientId,
    appointment.doctorId
  );
  const appointmentId = appointmentStore.getAppointmentID;

  if (
    (action === "approve" || action === "reject") &&
    appointment.status === Status.PENDING
  ) {
    if (action === "approve") {
      await appointmentStore.approveAppointment(appointmentId);
    } else if (action === "reject") {
      await appointmentStore.rejectAppointment(appointmentId);
    }
  } else if (action === "complete" && appointment.status === Status.APPROVED) {
    await appointmentStore.fetchAppointment(appointmentId);

    if (appointment.patientId) {
      await patientStore.fetchPatient(appointment.patientId);
    }

    if (appointment.doctorId) {
      await doctorStore.fetchDoctor(appointment.doctorId);
    }
  }

  await doctorStore.fetchAppointments(doctorStore.userID);
  fetchPatientData();
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
</script>

<style scoped></style>
