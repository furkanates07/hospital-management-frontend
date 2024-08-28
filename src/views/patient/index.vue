<template>
  <div class="flex">
    <div class="w-64 bg-teal-500 text-white fixed h-full">
      <div class="p-4 font-bold text-lg flex justify-center">
        <span>{{ patientStore.getPatientFullName }}</span>
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
import { useAuth } from "@/composables/useAuth";
import { usePatientStore } from "@/stores/patient";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const tabs = [
  { name: "Home", key: "home", icon: "home" },
  { name: "Appointments", key: "appointments", icon: "calendar_month" },
  { name: "Medical Records", key: "medical-records", icon: "folder" },
  { name: "Profile", key: "profile", icon: "person" },
  { name: "Logout", key: "logout", icon: "logout" },
];

const selectedTab = ref("");
const router = useRouter();
const { logout } = useAuth();
const patientStore = usePatientStore();

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

const handleTabChange = (key: string) => {
  if (key === "logout") {
    logout();
    router.push("/login");
  } else {
    selectedTab.value = key;
  }
};
</script>

<style scoped></style>
