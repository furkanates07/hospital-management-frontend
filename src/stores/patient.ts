import {
  ChangePassword,
  Patient,
  PatientConditions,
  PatientDetails,
} from "@/interfaces";
import { Appointment } from "@/interfaces/appointment";
import appointmentApi from "@/services/appointmentApi";
import patientApi from "@/services/patientApi";
import { defineStore } from "pinia";

export const usePatientStore = defineStore("patient", {
  state: () => ({
    patient: {} as Patient,
    loading: false,
    userID: "",
    error: "",
    appointments: [] as Appointment[],
  }),

  getters: {
    getPatient(): Patient {
      return this.patient;
    },
    getPatientFullName(): string {
      return this.patient.name;
    },
    getUserID(): string {
      return this.userID;
    },
    getAppointments(): Appointment[] {
      return this.appointments;
    },
    getError(): string {
      return this.error;
    },
  },

  actions: {
    async setUserID(id: string) {
      this.userID = id;
    },

    async fetchPatient(id: string): Promise<Patient> {
      this.loading = true;
      try {
        const response = await patientApi.getPatientById(id);
        this.patient = response.data;
        this.setUserID(response.data._id);
        return this.patient;
      } catch (err: any) {
        this.error = err.response?.data?.message;
      } finally {
        this.loading = false;
      }
      return {} as Patient;
    },

    async changePassword(id: string, data: ChangePassword) {
      this.loading = true;
      try {
        await patientApi.changePassword(id, data);
      } catch (err: any) {
        this.error = err.response?.data?.message;
      } finally {
        this.loading = false;
      }
    },

    async updatePatientDetails(id: string, data: PatientDetails) {
      this.loading = true;
      try {
        const response = await patientApi.updatePatientDetails(id, data);
        this.patient = { ...this.patient, ...response.data };
      } catch (err: any) {
        this.error = err.response?.data?.message;
      } finally {
        this.loading = false;
      }
    },

    async updatePatientConditions(id: string, data: PatientConditions) {
      this.loading = true;
      try {
        const response = await patientApi.updatePatientConditions(id, data);
        this.patient = { ...this.patient, ...response.data };
      } catch (err: any) {
        this.error = err.response?.data?.message;
      } finally {
        this.loading = false;
      }
    },

    async deletePatient(id: string) {
      this.loading = true;
      try {
        await patientApi.deletePatient(id);
        this.patient = {} as Patient;
      } catch (err: any) {
        this.error = err.response?.data?.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchAppointments(id: string): Promise<Appointment[]> {
      this.loading = true;
      try {
        const response = await appointmentApi.getAppointmentsByPatientId(id);
        this.appointments = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message;
      } finally {
        this.loading = false;
      }
      return [] as Appointment[];
    },

    async logout() {
      this.patient = {} as Patient;
      this.appointments = [];
      this.userID = "";
      this.error = "";
      this.loading = false;
    },
  },
});
