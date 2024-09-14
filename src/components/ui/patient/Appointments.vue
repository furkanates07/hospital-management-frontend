<!-- Main Component -->
<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div v-if="loading" class="text-gray-600">Loading...</div>

    <div class="w-full max-w-2xl relative">
      <Header @create-appointment="onCreateAppointment" />

      <StatusFilter
        :status="status"
        :selected-status="selectedStatus"
        @status-change="onStatusChange"
      />

      <AppointmentList
        :appointments="filteredAppointments"
        :doctor-names="doctorNames"
        :doctor-specialities="doctorSpecialities"
        @cancel-appointment="cancelAppointment"
      />
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
import { useRouter } from "vue-router";
import AppointmentList from "./appointments/AppointmentList.vue";
import Header from "./appointments/Header.vue";
import StatusFilter from "./appointments/StatusFilter.vue";

const patientStore = usePatientStore();
const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();
const router = useRouter();

const doctorNames = ref<Record<string, string>>({});
const doctorSpecialities = ref<Record<string, string>>({});
const selectedStatus = ref<string>("");
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

  const priorityOrder = {
    [Status.PENDING]: 1,
    [Status.APPROVED]: 2,
    [Status.REJECTED]: 3,
    [Status.CANCELED]: 4,
    [Status.COMPLETED]: 5,
  };

  return filtered.sort((a, b) => {
    const priorityA = priorityOrder[a.status];
    const priorityB = priorityOrder[b.status];

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const dateA = new Date(a.slot.date).getTime();
    const dateB = new Date(b.slot.date).getTime();

    return dateA - dateB;
  });
});

const fetchDoctorData = async () => {
  const appointmentDoctors = Array.from(
    new Set(appointments.value.map((a) => a.doctorId))
  );

  const doctorPromises = appointmentDoctors.map(async (doctorId) => {
    const doctor = await doctorStore.fetchDoctor(doctorId);
    return { doctorId, doctor };
  });

  const doctorData = await Promise.all(doctorPromises);

  doctorNames.value = doctorData.reduce((acc, { doctorId, doctor }) => {
    acc[doctorId] = doctor?.name || "Unknown Doctor";
    return acc;
  }, {} as Record<string, string>);

  doctorSpecialities.value = doctorData.reduce((acc, { doctorId, doctor }) => {
    acc[doctorId] = doctor?.speciality || "Unknown Speciality";
    return acc;
  }, {} as Record<string, string>);
};

const cancelAppointment = async (appointment: Appointment): Promise<void> => {
  if (![Status.PENDING, Status.APPROVED].includes(appointment.status)) {
    console.warn(
      `Cannot cancel appointment with status: ${appointment.status}`
    );
    return;
  }

  try {
    const appointmentId: string =
      ((await appointmentStore.getAppointmentIdByPatientIdAndDoctorId(
        appointment.patientId,
        appointment.doctorId
      )) as string) || "";

    if (!appointmentId) {
      console.error("Failed to get appointment ID");
      return;
    }

    await appointmentStore.cancelAppointment(appointmentId);

    await patientStore.fetchAppointments(patientStore.userID);
    await fetchDoctorData();

    console.log("Appointment cancelled successfully");
  } catch (error) {
    console.error(`Error cancelling appointment: ${error}`);
  }
};

const onStatusChange = (newStatus: string) => {
  selectedStatus.value = newStatus;
};

const onCreateAppointment = () => {
  router.push("/create-appointment");
};
</script>
