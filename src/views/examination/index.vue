<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div class="w-full max-w-2xl relative">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-teal-500">Examination</h1>
      </div>

      <div class="py-4">
        <div
          v-for="(value, key) in patientMedicalRecords"
          :key="key"
          class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-teal-500"
        >
          <h2 class="text-teal-500 font-semibold mb-2">{{ key }}</h2>

          <ul v-if="Array.isArray(value)" class="list-disc list-inside">
            <li
              v-for="(item, index) in value"
              :key="index"
              class="flex justify-between items-center p-2"
            >
              {{ item }}
              <button
                @click="removeCondition(key as string, index)"
                class="text-red-500 text-sm ml-2 flex items-center hover:text-red-600 transition duration-200 ease-in-out"
              >
                <span class="material-symbols-outlined"> delete </span>
              </button>
            </li>
          </ul>

          <p v-else>{{ value || "N/A" }}</p>

          <div class="mt-2 flex">
            <input
              v-model="newCondition[key as string]"
              type="text"
              placeholder="Add new condition"
              class="border p-2 rounded-lg flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <button
              @click="addCondition(key as string)"
              class="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-teal-600 transition duration-200 ease-in-out"
            >
              <span class="material-symbols-outlined"> add </span>
            </button>
          </div>
        </div>

        <div
          class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-teal-500"
        >
          <h2 class="text-teal-500 font-semibold mb-2">Prescription</h2>

          <textarea
            v-model="updatedPrescription"
            placeholder="Update prescription details"
            rows="4"
            class="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
          ></textarea>
        </div>

        <div class="flex justify-end mt-4">
          <button
            @click="saveChanges"
            class="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition duration-200 ease-in-out"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Appointment, Patient, UpdatePrescription } from "@/interfaces";
import router from "@/router";
import { useAppointmentStore } from "@/stores/appointment";
import { usePatientStore } from "@/stores/patient";
import { computed, onMounted, ref } from "vue";

const appointmentStore = useAppointmentStore();
const patientStore = usePatientStore();

const appointment = ref<Appointment | null>(null);
const patient = ref<Patient | null>(null);

onMounted(async () => {
  appointment.value = await appointmentStore.getAppointment;
  patient.value = await patientStore.getPatient;
  console.log(appointment.value);
});

const patientMedicalRecords = computed(() => ({
  "Medical History": patient.value?.medicalHistory || [],
  Allergies: patient.value?.allergies || [],
  "Chronic Conditions": patient.value?.chronicConditions || [],
}));

const newCondition = ref<{ [key: string]: string }>({});
const updatedPrescription = ref<string>(appointment.value?.prescription || "");

const addCondition = (key: string) => {
  if (newCondition.value[key]) {
    if (key === "Medical History") {
      patient.value!.medicalHistory?.push(newCondition.value[key]);
    } else if (key === "Allergies") {
      patient.value!.allergies?.push(newCondition.value[key]);
    } else if (key === "Chronic Conditions") {
      patient.value!.chronicConditions?.push(newCondition.value[key]);
    }
    newCondition.value[key] = "";
  }
};

const removeCondition = (key: string, index: number) => {
  if (key === "Medical History") {
    patient.value!.medicalHistory?.splice(index, 1);
  } else if (key === "Allergies") {
    patient.value!.allergies?.splice(index, 1);
  } else if (key === "Chronic Conditions") {
    patient.value!.chronicConditions?.splice(index, 1);
  }
};

const saveChanges = async () => {
  try {
    const updatedConditions = {
      medicalHistory: patient.value?.medicalHistory || [],
      allergies: patient.value?.allergies || [],
      chronicConditions: patient.value?.chronicConditions || [],
    };

    await patientStore.updatePatientConditions(
      patientStore.getUserID,
      updatedConditions
    );

    if (appointment.value && updatedPrescription.value) {
      const prescriptionData: UpdatePrescription = {
        prescription: updatedPrescription.value,
      };

      await appointmentStore.updatePrescription(
        appointmentStore.getAppointmentID,
        prescriptionData
      );
    }

    console.log("Changes saved successfully!");

    await appointmentStore.completeAppointment(
      appointmentStore.getAppointmentID
    );

    newCondition.value = {};
    updatedPrescription.value = "";
    appointment.value = null;
    patient.value = null;

    confirm("Changes saved successfully!");

    router.push("/home");
  } catch (error) {
    alert("Error saving changes. Please try again.");
    console.error("Error saving changes:", error);
  }
};
</script>

<style scoped></style>
