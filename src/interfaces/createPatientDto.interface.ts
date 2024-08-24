import { Role } from "../enums/role.enum";

export interface CreatePatientDto {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  role?: Role;
  emergencyContact?: [];
  medicalHistory?: string[];
  allergies?: string[];
  chronicConditions?: string[];
}
