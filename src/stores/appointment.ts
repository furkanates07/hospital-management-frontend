import { Appointment, UpdatePrescription } from "@/interfaces/appointment";
import appointmentApi from "@/services/appointmentApi";
import { defineStore } from "pinia";

export const useAppointmentStore = defineStore("appointment", {
  state: () => ({
    appointment: {} as Appointment,
    appointmentID: "",
    loading: false,
    error: "",
  }),

  getters: {
    getAppointment(): Appointment {
      return this.appointment;
    },
    getAppointmentID(): string {
      return this.appointmentID;
    },
    getError(): string {
      return this.error;
    },
  },

  actions: {
    async setAppointmentID(id: string) {
      this.appointmentID = id;
    },

    async createAppointment(appointmentData: Appointment) {
      this.loading = true;
      try {
        const response = await appointmentApi.createAppointment(
          appointmentData
        );
        this.appointment = response.data;
        this.appointmentID = response.data._id;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchAppointment(id: string) {
      this.loading = true;
      try {
        const response = await appointmentApi.getAppointmentById(id);
        this.appointment = response.data;
        this.appointmentID = response.data._id;
        console.log(this.appointment);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async approveAppointment(id: string) {
      this.loading = true;
      try {
        const response = await appointmentApi.approveAppointment(id);
        this.appointment = { ...this.appointment, ...response.data };
        console.log("Appointment approved successfully");
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async rejectAppointment(id: string) {
      this.loading = true;
      try {
        const response = await appointmentApi.rejectAppointment(id);
        this.appointment = { ...this.appointment, ...response.data };
        console.log("Appointment rejected successfully");
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async cancelAppointment(id: string) {
      this.loading = true;
      try {
        const response = await appointmentApi.cancelAppointment(id);
        this.appointment = { ...this.appointment, ...response.data };
        console.log("Appointment cancelled successfully");
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async completeAppointment(id: string) {
      this.loading = true;
      try {
        const response = await appointmentApi.completeAppointment(id);
        this.appointment = { ...this.appointment, ...response.data };
        console.log("Appointment completed successfully");
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updatePrescription(id: string, data: UpdatePrescription) {
      this.loading = true;
      try {
        const response = await appointmentApi.updatePrescription(id, data);
        console.log("API Response:", response);
        this.appointment = { ...this.appointment, ...response.data };
        console.log("Prescription updated successfully");
      } catch (error: any) {
        console.error("API Error:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
