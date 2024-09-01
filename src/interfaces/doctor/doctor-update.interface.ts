import { Role, Speciality, Title } from "@/enums";

export interface DoctorUpdate {
  name?: string;
  email?: string;
  password?: string;
  speciality?: Speciality;
  title?: Title;
  yearsOfExperience?: number;
  role?: Role;
}
