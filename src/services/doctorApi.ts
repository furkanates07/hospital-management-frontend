import { Speciality } from "@/enums";
import { Doctor, DoctorUpdate } from "@/interfaces";
import apiClient from "./apiClient";

export default {
  createDoctor(doctorData: Doctor) {
    return apiClient.post("/doctors", doctorData);
  },

  getAllDoctors() {
    return apiClient.get("/doctors");
  },

  getDoctorById(id: string) {
    return apiClient.get(`/doctors/${id}`);
  },

  getDoctorByEmail(email: string) {
    return apiClient.get(`/doctors/email/${email}`);
  },

  getDoctorsBySpeciality(speciality: Speciality) {
    return apiClient.get("/doctors/speciality/" + speciality);
  },

  updateDoctorDetails(id: string, data: DoctorUpdate) {
    return apiClient.patch(`/doctors/${id}`, data);
  },

  deleteDoctor(id: string) {
    return apiClient.delete(`/doctors/${id}`);
  },
};
