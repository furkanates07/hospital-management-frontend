<template>
  <div class="grid grid-cols-6 h-screen">
    <div class="col-span-1 bg-teal-500 text-white">
      <div class="p-4 font-bold text-lg flex justify-center">
        <span>{{ fullName }}</span>
      </div>
      <div
        v-for="tab in tabs"
        :key="tab.key"
        @click="handleTabChange(tab.key)"
        :class="[
          'p-4 cursor-pointer hover:bg-teal-600',
          tab.key === selectedTab ? 'bg-teal-700' : '',
        ]"
      >
        <div class="flex flex-row gap-4 py-3 px-4">
          <span class="material-symbols-outlined">{{ tab.icon }}</span>
          <span class="hidden sm:block">{{ tab.name }}</span>
        </div>
      </div>
    </div>

    <div class="col-span-5">
      <component :is="activeComponent"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import DoctorAppointments from "@/components/ui/doctor/Appointments.vue";
import DoctorHome from "@/components/ui/doctor/Home.vue";
import DoctorProfile from "@/components/ui/doctor/Profile.vue";
import PatientAppointments from "@/components/ui/patient/Appointments.vue";
import PatientHome from "@/components/ui/patient/Home.vue";
import PatientMedicalRecords from "@/components/ui/patient/MedicalRecords.vue";
import PatientProfile from "@/components/ui/patient/Profile.vue";
import { Role } from "@/enums";
import { useAuthStore } from "@/stores/auth";
import { useDoctorStore } from "@/stores/doctor";
import { usePatientStore } from "@/stores/patient";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const selectedTab = ref("");
const router = useRouter();
const patientStore = usePatientStore();
const doctorStore = useDoctorStore();

const tabs = ref(
  authStore.role === "doctor"
    ? [
        { name: "Home", key: "home", icon: "home" },
        { name: "Appointments", key: "appointments", icon: "calendar_month" },
        { name: "Profile", key: "profile", icon: "person" },
        { name: "Logout", key: "logout", icon: "logout" },
      ]
    : [
        { name: "Home", key: "home", icon: "home" },
        { name: "Appointments", key: "appointments", icon: "calendar_month" },
        { name: "Medical Records", key: "medical-records", icon: "folder" },
        { name: "Profile", key: "profile", icon: "person" },
        { name: "Logout", key: "logout", icon: "logout" },
      ]
);

const activeComponent = computed(() => {
  switch (selectedTab.value) {
    case "home":
      return authStore.role === Role.DOCTOR ? DoctorHome : PatientHome;
    case "appointments":
      return authStore.role === Role.DOCTOR
        ? DoctorAppointments
        : PatientAppointments;
    case "medical-records":
      return PatientMedicalRecords;
    case "profile":
      return authStore.role === Role.DOCTOR ? DoctorProfile : PatientProfile;
    case "logout":
      return null;
    default:
      return authStore.role === Role.DOCTOR ? DoctorHome : PatientHome;
  }
});

const fullName = computed(() => {
  if (authStore.role === Role.DOCTOR) {
    return doctorStore.getDoctorFullName;
  } else {
    return patientStore.getPatientFullName;
  }
});

const handleTabChange = (key: string) => {
  if (key === "logout") {
    if (authStore.role === Role.DOCTOR) {
      doctorStore.logout();
    } else {
      patientStore.logout();
    }
    authStore.logout();
    router.push("/login");
  } else {
    selectedTab.value = key;
  }
};
</script>

<style scoped></style>
