<template>
  <div>examination</div>
</template>

<script setup lang="ts">
import { Doctor, Patient } from "@/interfaces";
import { Appointment } from "@/interfaces/appointment";
import { useAppointmentStore } from "@/stores/appointment";
import { useDoctorStore } from "@/stores/doctor";
import { usePatientStore } from "@/stores/patient";
import { onMounted, ref } from "vue";

const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();
const patientStore = usePatientStore();

const appointment = ref<Appointment | null>(null);
const patient = ref<Patient | null>(null);
const doctor = ref<Doctor | null>(null);

onMounted(async () => {
  appointment.value = await appointmentStore.getAppointment;
  patient.value = await patientStore.getPatient;
  doctor.value = await doctorStore.getDoctor;
  console.log(appointment.value);
  console.log(patient.value);
  console.log(doctor.value);
});
</script>

<style scoped></style>
