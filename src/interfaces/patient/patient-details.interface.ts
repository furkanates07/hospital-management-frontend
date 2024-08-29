import { EmergencyContact } from "../emergency-contact.interface";

export interface PatientDetails {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: EmergencyContact[];
}
