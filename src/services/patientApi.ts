import {
  ChangePassword,
  Patient,
  PatientConditions,
  PatientDetails,
} from "@/interfaces/index";
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

  changePassword(id: string, data: ChangePassword) {
    return apiClient.patch(`/patients/${id}/change-password`, data);
  },

  updatePatientDetails(id: string, data: PatientDetails) {
    console.log("API Call: Updating patient details", id, data);
    return apiClient.patch(`/patients/${id}`, data);
  },

  updatePatientConditions(id: string, data: PatientConditions) {
    return apiClient.patch(`/patients/${id}/conditions`, data);
  },

  deletePatient(id: string) {
    return apiClient.delete(`/patients/${id}`);
  },
};
