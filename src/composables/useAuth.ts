import { ref } from "vue";
import { CreatePatientDto, LoginDto } from "../interfaces/index";
import authApi from "../services/authApi";

export function useAuth() {
  const error = ref<string | null>(null);
  const token = ref<string | null>(null);

  const login = async (loginData: LoginDto, role: "doctor" | "patient") => {
    try {
      const response =
        role === "doctor"
          ? await authApi.loginDoctor(loginData)
          : await authApi.loginPatient(loginData);

      token.value = response.data.access_token;
      console.log(token.value);
      error.value = null;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Login failed";
    }
  };

  const registerPatient = async (patientData: CreatePatientDto) => {
    try {
      const response = await authApi.registerPatient(patientData);
      token.value = response.data.access_token;
      console.log(token.value);
      error.value = null;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Registration failed";
    }
  };

  return {
    login,
    registerPatient,
    error,
    token,
  };
}
