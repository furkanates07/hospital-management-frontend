import { Login, Patient } from "../interfaces/index";
import apiClient from "./apiClient";

export default {
  loginPatient(loginData: Login) {
    return apiClient.post("/auth/patient-login", loginData);
  },

  loginDoctor(loginData: Login) {
    return apiClient.post("/auth/doctor-login", loginData);
  },

  registerPatient(patientData: Patient) {
    return apiClient.post("/auth/patient-register", patientData);
  },

  registerDoctor(doctorData: any) {
    return apiClient.post("/auth/doctor-register", doctorData);
  },
};
