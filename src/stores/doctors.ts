import { Speciality } from "@/enums";
import { Doctor } from "@/interfaces";
import doctorApi from "@/services/doctorApi";
import { defineStore } from "pinia";

export const useDoctorsStore = defineStore("doctors", {
  state: () => ({
    doctors: [] as Doctor[],
    loading: false,
    error: "",
  }),

  getters: {
    getDoctors(): Doctor[] {
      return this.doctors;
    },
  },

  actions: {
    async fetchDoctors(): Promise<Doctor[]> {
      this.loading = true;
      try {
        const response = await doctorApi.getAllDoctors();
        this.doctors = response.data;
        return this.getDoctors;
      } catch (err: any) {
        this.error = err.response?.data?.message;
      } finally {
        this.loading = false;
      }
      return [] as Doctor[];
    },

    async fetchDoctorsBySpeciality(speciality: Speciality): Promise<Doctor[]> {
      this.loading = true;
      try {
        const response = await doctorApi.getDoctorsBySpeciality(speciality);
        this.doctors = response.data;
        return this.doctors;
      } catch (err: any) {
        this.error = err.response?.data?.message;
      } finally {
        this.loading = false;
      }
      return [] as Doctor[];
    },

    async logout() {
      this.doctors = [];
      this.loading = false;
      this.error = "";
    },
  },
});
