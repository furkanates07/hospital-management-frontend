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
    async fetchDoctors() {
      this.loading = true;
      try {
        const response = await doctorApi.getAllDoctors();
        this.doctors = response.data;
        return this.doctors;
      } catch (err: any) {
        this.error = err.response?.data?.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchDoctorsBySpeciality(speciality: Speciality) {
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
    },
  },
});
