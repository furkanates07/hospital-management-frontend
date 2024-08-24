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

      <div class="mb-6">
        <label for="name" class="block text-teal-500 text-sm font-bold mb-2">
          Name
        </label>
        <input
          v-model="registerData.name"
          id="name"
          type="text"
          placeholder="Future Hendrix"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          required
        />
      </div>

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
      </div>

      <div class="mb-6">
        <label
          for="password"
          class="block text-teal-500 text-sm font-bold mb-2"
        >
          Password
        </label>
        <input
          v-model="registerData.password"
          id="password"
          type="password"
          placeholder="********"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          required
        />
      </div>

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
      </div>

      <div class="mb-6 flex flex-col sm:flex-row sm:justify-between">
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
            type="text"
            placeholder="dd/mm/yyyy"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            required
          />
        </div>

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
              />
              <span class="ml-2 text-teal-600">Female</span>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        Register
      </button>
      <p v-if="error" class="mt-4 text-red-500 text-center text-sm">
        {{ error }}
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
import { useAuth } from "@/composables/useAuth";
import { CreatePatientDto } from "@/interfaces/createPatientDto.interface";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { registerPatient, error } = useAuth();
const router = useRouter();

const registerData = ref<CreatePatientDto>({
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
});

const handleRegister = async () => {
  try {
    await registerPatient(registerData.value);
    router.push("/login");
  } catch (err: any) {
    error.value = err.message;
  }
};
</script>
