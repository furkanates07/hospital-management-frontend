import { Status } from "@/enums/status.enum";
import { Slot } from "./index";

export interface Appointment {
  patientId: string;
  doctorId: string;
  slot: Slot;
  status: Status;
  reason: string;
  prescription?: string;
}
