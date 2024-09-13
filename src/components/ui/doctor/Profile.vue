<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div class="w-full max-w-2xl relative">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-teal-500">Doctor Profile</h1>
      </div>

      <div class="py-4">
        <div
          v-for="(value, key) in doctorDetails"
          :key="key"
          class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-teal-500"
        >
          <h2 class="text-teal-500 font-semibold mb-2">{{ key }}</h2>
          <p>{{ value || "N/A" }}</p>
        </div>

        <!-- Change Password Section -->
        <div
          class="mt-6 bg-white p-4 rounded-lg shadow-md border-l-4 border-teal-500"
        >
          <div v-if="!isChangingPassword" class="flex justify-center">
            <button
              @click="toggleChangePasswordForm"
              class="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Change Password
            </button>
          </div>

          <!-- Change Password Form -->
          <div v-if="isChangingPassword" class="mt-4">
            <h2 class="text-xl font-semibold text-teal-500 mb-4">
              Change Password
            </h2>
            <form @submit.prevent="handleChangePassword">
              <div class="space-y-4">
                <div>
                  <input
                    id="oldPassword"
                    placeholder="Old Password"
                    v-model="changePassword.oldPassword"
                    type="password"
                    class="mt-1 p-2 border border-teal-500 rounded-lg w-full"
                    required
                  />
                </div>
                <div>
                  <input
                    id="newPassword"
                    placeholder="New Password"
                    v-model="changePassword.newPassword"
                    type="password"
                    class="mt-1 p-2 border border-teal-500 rounded-lg w-full"
                    required
                  />
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex justify-center mt-4">
                  <p v-if="doctorStore.getError" class="text-red-500 text-sm">
                    {{ doctorStore.getError }}
                  </p>
                </div>
                <div class="flex flex-row justify-end mt-4">
                  <button
                    type="submit"
                    class="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Change Password
                  </button>
                  <button
                    @click="cancelPasswordChange"
                    type="button"
                    class="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 ml-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChangePassword } from "@/interfaces";
import { useDoctorStore } from "@/stores/doctor";
import { computed, ref } from "vue";

const doctorStore = useDoctorStore();
const userID = doctorStore.getUserID;

const isChangingPassword = ref(false);
const changePassword = ref<ChangePassword>({
  oldPassword: "",
  newPassword: "",
});

const doctor = computed(() => doctorStore.getDoctor);

const doctorDetails = computed(() => ({
  Name: doctor.value.name,
  Email: doctor.value.email,
  Speciality: doctor.value.speciality,
  Title: doctor.value.title,
  "Years of Experience": doctor.value.yearsOfExperience,
}));

const toggleChangePasswordForm = () => {
  isChangingPassword.value = !isChangingPassword.value;
};

const handleChangePassword = async (): Promise<void> => {
  if (!changePassword.value.oldPassword || !changePassword.value.newPassword) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    await doctorStore.changePassword(userID, changePassword.value);
    changePassword.value = { oldPassword: "", newPassword: "" };
    isChangingPassword.value = false;
    alert("Password changed successfully!");
  } catch (error) {
    alert("An error occurred while changing the password. Please try again.");
  }
};

const cancelPasswordChange = (): void => {
  changePassword.value = {
    oldPassword: "",
    newPassword: "",
  };
  isChangingPassword.value = false;
};
</script>

<style scoped>
/* Scoped CSS here */
</style>
