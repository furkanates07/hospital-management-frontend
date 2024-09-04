import { Doctor, DoctorUpdate } from "@/interfaces";
import { Appointment } from "@/interfaces/appointment";
import appointmentApi from "@/services/appointmentApi";
import doctorApi from "@/services/doctorApi";
import { defineStore } from "pinia";

export const useDoctorStore = defineStore("doctor", {
  state: () => ({
    doctor: {} as Doctor,
    userID: "",
    loading: false,
    error: "",
    appointments: [] as Appointment[],
  }),

  getters: {
    getDoctor(): Doctor {
      return this.doctor;
    },
    getDoctorFullName(): string {
      return this.doctor.name;
    },
    getUserID(): string {
      return this.userID;
    },
    getAppointments(): Appointment[] {
      return this.appointments;
    },
  },

  actions: {
    async setUserID(id: string) {
      this.userID = id;
    },

    async fetchDoctorNamebyID(id: string) {
      this.loading = true;
      try {
        const response = await doctorApi.getDoctorById(id);
        this.doctor = response.data;
        return this.doctor.name;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchDoctor(id: string) {
      this.loading = true;
      try {
        const response = await doctorApi.getDoctorById(id);
        this.doctor = response.data;
        console.log(this.doctor);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updateDoctorDetails(id: string, data: DoctorUpdate) {
      this.loading = true;
      try {
        const response = await doctorApi.updateDoctorDetails(id, data);
        console.log("API Response:", response);
        this.doctor = { ...this.doctor, ...response.data };
        console.log("Doctor details updated successfully");
      } catch (error: any) {
        console.error("API Error:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async deleteDoctor(id: string) {
      this.loading = true;
      try {
        await doctorApi.deleteDoctor(id);
        this.doctor = {} as Doctor;
        console.log("Doctor deleted successfully");
      } catch (error: any) {
        console.error("API Error:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchAppointments(id: string) {
      this.loading = true;
      try {
        const response = await appointmentApi.getAppointmentsByDoctorId(id);
        this.appointments = response.data;
        console.log(this.appointments);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
