import { Role, Speciality, Title } from "@/enums";

export interface Doctor {
  name: string;
  email: string;
  password: string;
  specialty: Speciality;
  title: Title;
  yearsOfExperience: number;
  role: Role;
}
