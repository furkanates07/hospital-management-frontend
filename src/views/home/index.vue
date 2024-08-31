<template>
  <div class="flex">
    <div class="w-64 bg-teal-500 text-white fixed h-full">
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

    <div class="flex-1 ml-64">
      <component :is="activeComponent"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import Appointments from "@/components/ui/patient/Appointments.vue";
import Home from "@/components/ui/patient/Home.vue";
import MedicalRecords from "@/components/ui/patient/MedicalRecords.vue";
import Profile from "@/components/ui/patient/Profile.vue";
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
      return Home;
    case "appointments":
      return Appointments;
    case "medical-records":
      return MedicalRecords;
    case "profile":
      return Profile;
    case "logout":
      return null;
    default:
      return Home;
  }
});

const fullName = computed(() => {
  if (authStore.role === "doctor") {
    return doctorStore.getDoctorFullName;
  } else {
    return patientStore.getPatientFullName;
  }
});

const handleTabChange = (key: string) => {
  if (key === "logout") {
    authStore.logout();
    router.push("/login");
  } else {
    selectedTab.value = key;
  }
};
</script>

<style scoped></style>
