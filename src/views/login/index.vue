<template>
  <div class="grid grid-cols-7 min-h-screen bg-teal-600">
    <div class="col-span-5 bg-gray-200 rounded-lg">
      <img
        src="../../assets/images/login.png"
        alt="Background"
        class="h-full w-full object-cover"
      />
    </div>
    <div class="col-span-2 flex items-center rounded-lg justify-center p-2">
      <form
        @submit.prevent="handleLogin"
        class="w-full h-full bg-white shadow-md rounded-lg p-12 flex flex-col justify-center"
      >
        <div class="flex flex-col text-center">
          <h1 class="text-3xl font-bold mb-1 text-teal-600">Welcome</h1>
          <p class="mb-6 font-light text-gray-600">
            Please enter your details!
          </p>
        </div>
        <div class="mb-4">
          <input
            v-model="loginData.email"
            id="email"
            type="email"
            placeholder="Email"
            class="mt-1 block w-full p-3 border-b border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-teal-500"
            required
          />
        </div>
        <div class="mb-4">
          <input
            v-model="loginData.password"
            id="password"
            type="password"
            placeholder="Password"
            class="mt-1 block w-full p-3 border-b border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-teal-500"
            required
          />
        </div>
        <div class="mb-6">
          <div class="flex flex-row justify-center gap-5">
            <button
              type="button"
              :class="[
                'py-2 px-4 rounded-lg',
                role === 'patient'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700',
              ]"
              @click="role = Role.PATIENT"
            >
              Patient
            </button>
            <button
              type="button"
              :class="[
                'py-2 px-4 rounded-lg',
                role === 'doctor'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700',
              ]"
              @click="role = Role.DOCTOR"
            >
              Doctor
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="w-full py-3 px-4 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Login
        </button>
        <p v-if="error" class="mt-4 text-red-500 text-center text-sm">
          {{ error }}
        </p>
        <router-link
          to="/register"
          class="block mt-4 text-teal-500 hover:underline text-center"
        >
          Not a member? Register here!
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { Role } from "@/enums/role.enum";
import { Login } from "@/interfaces/login.interface";
import router from "@/router";
import { ref } from "vue";

const { login, error } = useAuth();

const loginData = ref<Login>({
  email: "",
  password: "",
});
const role = ref<Role.DOCTOR | Role.PATIENT>(Role.PATIENT);

const handleLogin = async () => {
  if (role.value === Role.DOCTOR) {
    await login(loginData.value, Role.DOCTOR);
    router.push("/doctor");
  } else {
    router.push("/patient");
    await login(loginData.value, Role.PATIENT);
  }
};
</script>

<style scoped></style>
