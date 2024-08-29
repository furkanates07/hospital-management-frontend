import { Role } from "@/enums/role.enum";
import { EmergencyContact } from "../emergency-contact.interface";

export interface Patient {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  role?: Role.PATIENT;
  emergencyContact?: EmergencyContact[];
  medicalHistory?: string[];
  allergies?: string[];
  chronicConditions?: string[];
}
