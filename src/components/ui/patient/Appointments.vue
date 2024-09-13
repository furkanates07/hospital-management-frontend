<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div v-if="loading" class="text-gray-600">Loading...</div>

    <div class="w-full max-w-2xl relative">
      <!-- Header -->
      <div class="flex flex-row justify-between">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-teal-500">Appointments</h1>
        </div>
        <router-link to="/create-appointment">
          <button
            class="bg-teal-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
          >
            CREATE
          </button>
        </router-link>
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
              Appointment with Doctor:
              {{ doctorNames[appointment.doctorId] || "Loading..." }}
            </h2>
            <button
              v-if="
                appointment.status === Status.PENDING ||
                appointment.status === Status.APPROVED
              "
              @click="cancelAppointment(appointment)"
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

const patientStore = usePatientStore();
const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();

const doctorNames = ref<Record<string, string>>({});
const doctorSpecialities = ref<Record<string, string>>({});
const selectedStatus = ref<string>("");
const selectedAppointment = ref<Appointment | null>(null);
const selectedAppointmentId = ref<string>("");
const loading = ref<boolean>(true);

const status = Object.values(Status);

onMounted(async () => {
  try {
    loading.value = true;
    await patientStore.fetchAppointments(patientStore.userID);
    await fetchDoctorData();
  } finally {
    loading.value = false;
  }
});

const appointments = computed(() => {
  return patientStore.getAppointments.slice().sort((a, b) => {
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

const fetchDoctorData = async () => {
  const appointmentDoctors = Array.from(
    new Set(appointments.value.map((a) => a.doctorId))
  );
  const doctorPromises = appointmentDoctors.map((doctorId) =>
    doctorStore.fetchDoctor(doctorId)
  );
  await Promise.all(doctorPromises);

  doctorNames.value = appointmentDoctors.reduce((acc, doctorId) => {
    acc[doctorId] = doctorStore.getDoctorFullName;
    return acc;
  }, {} as Record<string, string>);

  doctorSpecialities.value = appointmentDoctors.reduce((acc, doctorId) => {
    acc[doctorId] = doctorStore.getDoctorSpeciality;
    return acc;
  }, {} as Record<string, string>);
};

const cancelAppointment = async (appointment: Appointment) => {
  if (![Status.PENDING, Status.APPROVED].includes(appointment.status)) return;

  selectedAppointment.value = appointment;
  await appointmentStore.getAppointmentIdByPatientIdAndDoctorId(
    appointment.patientId,
    appointment.doctorId
  );
  selectedAppointmentId.value = appointmentStore.getAppointmentID;

  await appointmentStore.cancelAppointment(selectedAppointmentId.value);
  await patientStore.fetchAppointments(patientStore.userID);
  await fetchDoctorData();
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
