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

  getAppointmentIdByPatientIdAndDoctorId(patientId: string, doctorId: string) {
    return apiClient.get(
      `/appointments/appointmentId/${patientId}/${doctorId}`
    );
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

  completeAppointment(id: string) {
    return apiClient.post(`/appointments/${id}/complete`);
  },

  updatePrescription(id: string, data: UpdatePrescription) {
    return apiClient.patch(`/appointments/${id}/prescription`, data);
  },
};
