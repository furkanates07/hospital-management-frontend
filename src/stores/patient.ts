import { Patient, PatientConditions, PatientDetails } from "@/interfaces/index";
import patientApi from "@/services/patientApi";
import { defineStore } from "pinia";

export const usePatientStore = defineStore("patient", {
  state: () => ({
    patient: {} as Patient,
    loading: false,
    userID: "",
    error: "",
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
  },

  actions: {
    async setUserID(id: string) {
      this.userID = id;
    },

    async fetchPatient(id: string) {
      this.loading = true;
      try {
        const response = await patientApi.getPatientById(id);
        this.patient = response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updatePatientDetails(id: string, data: PatientDetails) {
      this.loading = true;
      try {
        const response = await patientApi.updatePatientDetails(id, data);
        this.patient = { ...this.patient, ...response.data };
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updatePatientConditions(id: string, data: PatientConditions) {
      this.loading = true;
      try {
        const response = await patientApi.updatePatientConditions(id, data);
        this.patient = { ...this.patient, ...response.data };
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async deletePatient(id: string) {
      this.loading = true;
      try {
        await patientApi.deletePatient(id);
        this.patient = {} as Patient;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
