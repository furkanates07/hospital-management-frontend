import { Patient, PatientConditions, PatientDetails } from "@/interfaces/index";
import apiClient from "./apiClient";

export default {
  createPatient(patientData: Patient) {
    return apiClient.post("/patients", patientData);
  },

  getAllPatients() {
    return apiClient.get("/patients");
  },

  getPatientById(id: string) {
    return apiClient.get(`/patients/${id}`);
  },

  updatePatientDetails(id: string, data: PatientDetails) {
    return apiClient.put(`/patients/${id}`, data);
  },

  updatePatientConditions(id: string, data: PatientConditions) {
    return apiClient.patch(`/patients/${id}/conditions`, data);
  },

  deletePatient(id: string) {
    return apiClient.delete(`/patients/${id}`);
  },
};
