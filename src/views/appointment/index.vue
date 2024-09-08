<template>
  <div class="grid grid-cols-6 min-h-screen bg-teal-600">
    <!-- Sidebar -->
    <div class="col-span-1 bg-teal-500 p-4">
      <h2 class="text-white text-xl font-bold mb-4 flex justify-center">
        Specialties
      </h2>
      <ul class="space-y-2">
        <li
          v-for="speciality in specialities"
          :key="speciality"
          @click="selectSpeciality(speciality)"
          class="cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-teal-400"
          :class="{ 'bg-teal-400': speciality === selectedSpeciality }"
        >
          {{ speciality }}
        </li>
      </ul>
    </div>

    <!-- Main content -->
    <div
      class="col-span-5 bg-gray-100 min-h-screen flex flex-col items-center py-4"
    >
      <div class="w-full max-w-2xl relative">
        <div v-if="selectedDoctor">
          <!-- Appointment form -->
          <h1 class="text-3xl font-bold text-teal-600">New Appointment</h1>
          <form @submit.prevent="submitAppointment">
            <div class="py-4">
              <!-- Slot date -->
              <label for="date" class="block text-teal-500 font-semibold"
                >Date</label
              >
              <input
                type="date"
                v-model="appointmentSlot.date"
                class="w-full p-2 border rounded-md mb-4"
                @change="validateWeekdayandFetchAppointments"
                required
              />

              <p v-if="isWeekend" class="text-red-500 mb-4">
                Weekends are not available for appointments. Please select a
                weekday.
              </p>

              <p v-if="isPastDate" class="text-red-500 mb-4">
                The selected date cannot be in the past. Please select today or
                a future date.
              </p>

              <!-- Slot hour -->
              <label for="hour" class="block text-teal-500 font-semibold"
                >Time</label
              >
              <select
                v-model="appointmentSlot.hour"
                class="w-full p-2 border rounded-md mb-4"
                required
              >
                <option
                  v-for="hour in hours"
                  :key="hour"
                  :value="hour"
                  :disabled="isSlotUnavailable(hour)"
                  :class="{ 'text-gray-400': isSlotUnavailable(hour) }"
                >
                  {{ hour }}
                </option>
              </select>

              <!-- Reason -->
              <label for="reason" class="block text-teal-500 font-semibold"
                >Reason</label
              >
              <textarea
                v-model="appointmentReason"
                class="w-full p-2 border rounded-md mb-4"
                placeholder="Reason for the appointment"
                required
              ></textarea>

              <!-- Submit button -->
              <div class="flex flex-col items-center">
                <button
                  type="submit"
                  class="bg-teal-500 text-white px-4 py-2 rounded-md"
                >
                  Submit Appointment
                </button>
                <p
                  v-if="appointmentStore.getError"
                  class="mt-4 text-red-500 text-center text-sm"
                >
                  {{ appointmentStore.getError }}
                </p>
              </div>
            </div>
          </form>
        </div>

        <div v-else>
          <!-- Doctor list -->
          <h1 class="text-3xl font-bold text-teal-600">Doctors</h1>
          <div class="py-4">
            <div v-if="selectedSpeciality || doctors.length > 0">
              <div
                v-for="doctor in doctors"
                :key="doctor.email"
                @click="selectDoctor(doctor)"
                class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-teal-500 cursor-pointer"
              >
                <p class="font-semibold text-teal-500">
                  {{ doctor.name || "N/A" }}
                </p>
                <p class="text-gray-700">{{ doctor.title || "N/A" }}</p>
                <p class="text-gray-500">{{ doctor.speciality || "N/A" }}</p>
              </div>
            </div>
            <p v-if="doctors.length === 0" class="text-gray-500 mt-4">
              Select a specialty to see doctors or wait for the list to load.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hours, Speciality } from "@/enums";
import { Status } from "@/enums/status.enum";
import { Doctor, Slot } from "@/interfaces";
import { Appointment } from "@/interfaces/appointment";
import { useAppointmentStore } from "@/stores/appointment";
import { useDoctorStore } from "@/stores/doctor";
import { useDoctorsStore } from "@/stores/doctors";
import { usePatientStore } from "@/stores/patient";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const doctorsStore = useDoctorsStore();
const patientStore = usePatientStore();
const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();
const router = useRouter();

const doctors = ref<Doctor[]>([]);
const selectedSpeciality = ref<Speciality | null>(null);
const selectedDoctor = ref<Doctor | null>(null);
const unavailableSlots = ref<Hours[]>([]);
const appointmentSlot = ref<Slot>({ date: new Date(), hour: Hours.NINE });
const appointmentReason = ref("");
const isWeekend = ref(false);
const isPastDate = ref(false);

const specialities = Object.values(Speciality).sort();
const hours = Object.values(Hours);

const fetchDoctors = async () => {
  await doctorsStore.fetchDoctors();
  doctors.value = doctorsStore.getDoctors;
};

const fetchDoctorsBySpeciality = async (speciality: Speciality) => {
  await doctorsStore.fetchDoctorsBySpeciality(speciality);
  doctors.value = doctorsStore.getDoctors;
};

const selectSpeciality = async (speciality: Speciality) => {
  selectedSpeciality.value = speciality;
  await fetchDoctorsBySpeciality(speciality);
};

const selectDoctor = async (doctor: Doctor) => {
  selectedDoctor.value = doctor;
  doctorStore.fetchDoctorByEmail(doctor.email);
};

const submitAppointment = async () => {
  if (!selectedDoctor || !patientStore.getPatient) return;

  const appointment: Appointment = {
    patientId: patientStore.getUserID,
    doctorId: doctorStore.getUserID,
    status: Status.PENDING,
    slot: appointmentSlot.value,
    reason: appointmentReason.value,
  };

  await appointmentStore.createAppointment(appointment);

  router.push("/home");

  selectedDoctor.value = null;
  appointmentReason.value = "";
  appointmentSlot.value = { date: new Date(), hour: Hours.NINE };
};

const validateWeekdayandFetchAppointments = async () => {
  const selectedDate = new Date(appointmentSlot.value.date);
  const today = new Date();

  isWeekend.value = false;
  isPastDate.value = false;

  if (selectedDate < today) {
    isPastDate.value = true;
    appointmentSlot.value.date = today;
    return;
  }

  const day = selectedDate.getUTCDay();

  if (day === 0 || day === 6) {
    isWeekend.value = true;
    appointmentSlot.value.date = today;
    return;
  }

  isWeekend.value = false;
  const appointments = await doctorStore.fetchAppointments(
    doctorStore.getUserID
  );

  if (appointments) {
    unavailableSlots.value = appointments
      .filter(
        (appointment: { slot: { date: string | number | Date } }) =>
          new Date(appointment.slot.date).toDateString() ===
          new Date(appointmentSlot.value.date).toDateString()
      )
      .map((appointment: { slot: { hour: Hours } }) => appointment.slot.hour);
  }
};

const isSlotUnavailable = (hour: Hours) => {
  return unavailableSlots.value.includes(hour);
};

onMounted(async () => {
  await fetchDoctors();
});

watch(selectedSpeciality, (newSpeciality) => {
  if (newSpeciality) {
    fetchDoctorsBySpeciality(newSpeciality);
  } else {
    fetchDoctors();
  }
});
</script>

<style scoped></style>
