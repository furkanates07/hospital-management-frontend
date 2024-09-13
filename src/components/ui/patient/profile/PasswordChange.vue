<template>
  <div v-if="activeTab === 'profile'">
    <div
      class="mt-6 bg-white p-4 rounded-lg shadow-md border-l-4 border-teal-500"
    >
      <div v-if="!isChangingPassword" class="flex justify-center">
        <button
          @click="toggleChangePasswordForm"
          class="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
        >
          Change Password
        </button>
      </div>

      <!-- Change Password Form -->
      <div v-else class="mt-4">
        <h2 class="text-xl font-semibold text-teal-500 mb-4">
          Change Password
        </h2>
        <form @submit.prevent="changePasswordHandler">
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
              <p v-if="patientStore.getError" class="mt-2 text-red-500 text-sm">
                {{ patientStore.getError }}
              </p>
            </div>
            <div class="flex flex-row justify-end mt-4">
              <button
                type="submit"
                class="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
              >
                Change Password
              </button>
              <button
                @click="cancelPasswordChange"
                type="button"
                class="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  activeTab: "profile" | "contacts";
  isChangingPassword: boolean;
  changePassword: {
    oldPassword: string;
    newPassword: string;
  };
  toggleChangePasswordForm: () => void;
  changePasswordHandler: () => Promise<void>;
  cancelPasswordChange: () => void;
  patientStore: {
    getError: string | null;
  };
}>();
</script>
