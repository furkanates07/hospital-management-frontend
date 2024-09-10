import { Role } from "@/enums/role.enum";
import { Login, Patient } from "@/interfaces/index";
import { setAuthToken } from "@/services/apiClient";
import authApi from "@/services/authApi";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("access_token") as string | null,
    user: null as any | null,
    userId: null as string | null,
    role: null as Role | null,
    error: null as string | null,
  }),

  getters: {
    isAuth: (state) => !!state.token,
    getRole: (state) => state.role,
    getUserId: (state) => state.userId,
    getError: (state) => state.error,
  },

  actions: {
    async login(loginData: Login, loginRole: Role.DOCTOR | Role.PATIENT) {
      try {
        const response =
          loginRole === Role.DOCTOR
            ? await authApi.loginDoctor(loginData)
            : await authApi.loginPatient(loginData);

        if (response.data.access_token) {
          this.token = response.data.access_token;
          localStorage.setItem("access_token", this.token ?? "");
          setAuthToken();
          this.userId = response.data.userId;
          this.role = loginRole;
        }
        this.error = null;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Login failed";
      }
    },

    async registerPatient(patientData: Patient) {
      try {
        const response = await authApi.registerPatient(patientData);
        if (response.data.access_token) {
          this.token = response.data.access_token;
          localStorage.setItem("access_token", this.token ?? "");
          this.user = response.data.user;
          this.role = Role.PATIENT;
        }
        this.error = null;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Registration failed";
      }
    },

    logout() {
      localStorage.removeItem("access_token");
      setAuthToken();
      this.token = null;
      this.userId = null;
      this.role = null;
      this.error = null;
    },
  },
});
