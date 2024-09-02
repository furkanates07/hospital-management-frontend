import { Appointment, UpdatePrescription } from "@/interfaces/appointment";
import apiClient from "./apiClient";

export default {
  createAppointment(appointmentData: Appointment) {
    return apiClient.post("/appointments", appointmentData);
  },

  getAllAppointments() {
    return apiClient.get("/appointments");
  },

  getAppointmentById(id: string) {
    return apiClient.get(`/appointments/${id}`);
  },

  getAppointmentsByDoctorId(doctorId: string) {
    return apiClient.get(`/appointments/doctor/${doctorId}`);
  },

  getAppointmentsByPatientId(patientId: string) {
    return apiClient.get(`/appointments/patient/${patientId}`);
  },

  approveAppointment(id: string) {
    return apiClient.post(`/appointments/${id}/approve`);
  },

  rejectAppointment(id: string) {
    return apiClient.post(`/appointments/${id}/reject`);
  },

  cancelAppointment(id: string) {
    return apiClient.post(`/appointments/${id}/cancel`);
  },

  updatePrescription(id: string, data: UpdatePrescription) {
    console.log("API Call: Updating prescription", id, data);
    return apiClient.patch(`/appointments/${id}/prescription`, data);
  },
};
