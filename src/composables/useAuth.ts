import { Role } from "@/enums/role.enum";
import { ref } from "vue";
import { Login, Patient } from "../interfaces/index";
import authApi from "../services/authApi";

export function useAuth() {
  const error = ref<string | null>(null);
  const token = ref<string | null>(localStorage.getItem("access_token"));
  const user = ref<any>(null);
  const userId = ref<string | null>(null);

  const login = async (loginData: Login, role: Role.DOCTOR | Role.PATIENT) => {
    try {
      const response =
        role === Role.DOCTOR
          ? await authApi.loginDoctor(loginData)
          : await authApi.loginPatient(loginData);

      if (response.data.access_token) {
        token.value = response.data.access_token;
        localStorage.setItem("access_token", token.value ?? "");
        userId.value = response.data.userId;

        console.log("Token:", token.value);
        console.log("User ID:", userId.value);
      }
      error.value = null;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Login failed";
    }
  };

  const registerPatient = async (patientData: Patient) => {
    try {
      const response = await authApi.registerPatient(patientData);
      if (response.data.access_token) {
        token.value = response.data.access_token;
        localStorage.setItem("access_token", token.value ?? "");
        user.value = response.data.user;
      }
      error.value = null;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Registration failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    token.value = null;
    userId.value = null;
  };

  return {
    login,
    registerPatient,
    logout,
    error,
    token,
    user,
    userId,
  };
}
