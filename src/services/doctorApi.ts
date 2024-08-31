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

  updateDoctorDetails(id: string, data: DoctorUpdate) {
    console.log("API Call: Updating doctor details", id, data);
    return apiClient.patch(`/doctors/${id}`, data);
  },

  deleteDoctor(id: string) {
    return apiClient.delete(`/doctors/${id}`);
  },
};
