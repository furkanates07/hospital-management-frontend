import { CreatePatientDto, LoginDto } from "../interfaces/index";
import apiClient from "./apiClient";

export default {
  loginPatient(loginData: LoginDto) {
    return apiClient.post("/auth/patient-login", loginData);
  },

  loginDoctor(loginData: LoginDto) {
    return apiClient.post("/auth/doctor-login", loginData);
  },

  registerPatient(patientData: CreatePatientDto) {
    return apiClient.post("/auth/patient-register", patientData);
  },

  registerDoctor(doctorData: any) {
    return apiClient.post("/auth/doctor-register", doctorData);
  },
};
