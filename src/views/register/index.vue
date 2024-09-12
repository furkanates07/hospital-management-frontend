<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-100 to-teal-200"
  >
    <form
      @submit.prevent="handleRegister"
      class="bg-white shadow-lg rounded-lg px-8 pt-5 pb-5 w-full max-w-lg"
    >
      <h2 class="text-3xl font-bold mb-5 text-center text-teal-500">
        Register Patient
      </h2>

      <!-- Full Name -->
      <div class="mb-6">
        <label for="name" class="block text-teal-500 text-sm font-bold mb-2">
          Full Name
        </label>
        <input
          v-model="registerData.name"
          id="name"
          type="text"
          placeholder="Future Hendrix"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          required
        />
        <p v-if="formErrors.name" class="text-red-500 text-sm mt-2">
          {{ formErrors.name }}
        </p>
      </div>

      <!-- Email -->
      <div class="mb-6">
        <label for="email" class="block text-teal-500 text-sm font-bold mb-2">
          Email
        </label>
        <input
          v-model="registerData.email"
          id="email"
          type="email"
          placeholder="hendrix@example.com"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          required
        />
        <p v-if="formErrors.email" class="text-red-500 text-sm mt-2">
          {{ formErrors.email }}
        </p>
      </div>

      <!-- Password -->
      <div class="mb-6 relative">
        <label
          for="password"
          class="block text-teal-500 text-sm font-bold mb-2"
        >
          Password
        </label>
        <div class="relative">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="registerData.password"
            id="password"
            placeholder="********"
            class="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            required
          />
          <span
            class="material-symbols-outlined absolute inset-y-0 right-3 flex items-center text-teal-500 cursor-pointer"
            @click="togglePasswordVisibility"
          >
            {{ passwordVisible ? "visibility" : "visibility_off" }}
          </span>
        </div>
        <p v-if="formErrors.password" class="text-red-500 text-sm mt-2">
          {{ formErrors.password }}
        </p>
      </div>

      <!-- Phone Number -->
      <div class="mb-6">
        <label
          for="phoneNumber"
          class="block text-teal-500 text-sm font-bold mb-2"
        >
          Phone Number
        </label>
        <input
          v-model="registerData.phoneNumber"
          id="phoneNumber"
          type="text"
          placeholder="0512 345 6789"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          required
        />
        <p v-if="formErrors.phoneNumber" class="text-red-500 text-sm mt-2">
          {{ formErrors.phoneNumber }}
        </p>
      </div>

      <div class="mb-6 flex flex-col sm:flex-row sm:justify-between">
        <!-- Date of Birth -->
        <div class="mb-4 sm:mb-0 sm:w-1/2 pr-2">
          <label
            for="dateOfBirth"
            class="block text-teal-500 text-sm font-bold mb-2"
          >
            Date of Birth
          </label>
          <input
            v-model="registerData.dateOfBirth"
            id="dateOfBirth"
            type="date"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            required
          />
          <p v-if="formErrors.dateOfBirth" class="text-red-500 text-sm mt-2">
            {{ formErrors.dateOfBirth }}
          </p>
        </div>

        <!-- Gender -->
        <div class="mb-4 sm:w-1/2 pl-2">
          <label
            for="gender"
            class="block text-teal-500 text-sm font-bold mb-5"
          >
            Gender
          </label>
          <div class="flex space-x-6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                v-model="registerData.gender"
                value="Male"
                class="form-radio text-teal-600"
                required
              />
              <span class="ml-2 text-teal-600">Male</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                id="female"
                name="gender"
                v-model="registerData.gender"
                value="Female"
                class="form-radio text-teal-600"
                required
              />
              <span class="ml-2 text-teal-600">Female</span>
            </label>
          </div>
          <p v-if="formErrors.gender" class="text-red-500 text-sm mt-2">
            {{ formErrors.gender }}
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 active:bg-teal-700"
      >
        Register
      </button>

      <p
        v-if="authStore.getError"
        class="mt-4 text-red-500 text-center text-sm"
      >
        {{ authStore.getError }}
      </p>

      <router-link
        to="/login"
        class="block mt-4 text-teal-500 hover:underline text-center"
      >
        Already a member? Login here!
      </router-link>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Patient } from "@/interfaces/index";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const registerData = ref<Patient>({
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
});

const passwordVisible = ref(false);

const formErrors = ref<{ [key: string]: string }>({});

const isAtLeast16YearsOld = (dateOfBirth: string): boolean => {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  const age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();
  return age > 16 || (age === 16 && monthDifference >= 0);
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const handleRegister = async () => {
  formErrors.value = {};

  if (!registerData.value.name) {
    formErrors.value.name = "Full name is required.";
    return;
  }

  if (!registerData.value.email) {
    formErrors.value.email = "Email is required.";
    return;
  }

  if (!registerData.value.password) {
    formErrors.value.password = "Password is required.";
    return;
  }

  if (!registerData.value.phoneNumber) {
    formErrors.value.phoneNumber = "Phone number is required.";
    return;
  }

  if (!registerData.value.gender) {
    formErrors.value.gender = "Gender is required.";
    return;
  }

  if (!isAtLeast16YearsOld(registerData.value.dateOfBirth)) {
    formErrors.value.dateOfBirth =
      "You must be at least 16 years old to register.";
    return;
  }

  try {
    await authStore.registerPatient(registerData.value);
    alert("Patient registered successfully!");
    router.push("/login");
  } catch (err: any) {
    authStore.setError(err.message);
  }
};
</script>

<style scoped></style>
