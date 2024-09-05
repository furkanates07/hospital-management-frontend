<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div class="w-full max-w-2xl relative">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-teal-500">Patient Profile</h1>
      </div>

      <div class="flex justify-end gap-3 py-3">
        <div v-if="isEditing">
          <button
            @click="
              () => {
                saveChanges();
              }
            "
            class="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
          >
            Save Changes
          </button>
        </div>
        <button
          @click="toggleEditMode"
          :class="{
            'bg-teal-500 hover:bg-teal-600': !isEditing,
            'bg-rose-700 hover:bg-rose-800': isEditing,
          }"
          class="text-white py-2 px-4 rounded-lg"
        >
          {{ isEditing ? "Cancel" : "Edit" }}
        </button>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex space-x-4 mb-4">
        <button
          @click="activeTab = 'profile'"
          :class="{
            'text-teal-500 border-b-2 border-teal-500': activeTab === 'profile',
            'text-gray-600': activeTab !== 'profile',
          }"
          class="py-2 px-4 font-semibold"
        >
          Details
        </button>
        <button
          @click="activeTab = 'contacts'"
          :class="{
            'text-teal-500 border-b-2 border-teal-500':
              activeTab === 'contacts',
            'text-gray-600': activeTab !== 'contacts',
          }"
          class="py-2 px-4 font-semibold"
        >
          Emergency Contacts
        </button>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'profile'">
        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="(value, key) in patientDetails"
            :key="key"
            class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-4 border-teal-500"
          >
            <div class="flex-1">
              <h2 class="text-teal-500 font-semibold capitalize pl-2">
                {{ key }}
              </h2>
              <p v-if="!isEditing || !isEditableField(key)" class="mt-2 p-2">
                {{ value || "N/A" }}
              </p>
              <input
                v-else
                v-model="editableFields[key]"
                type="text"
                class="mt-2 p-2 border border-teal-500 rounded-lg w-full"
                :placeholder="key"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'contacts'">
        <div v-if="patient.emergencyContact?.length">
          <h2 class="text-xl font-semibold mt-4 text-teal-500">
            Emergency Contacts
          </h2>
          <ul class="space-y-2 mt-2">
            <li
              v-for="(contact, index) in patient.emergencyContact"
              :key="index"
              class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-4 border-teal-500"
            >
              <div>
                <p><strong>Name:</strong> {{ contact.name }}</p>
                <p><strong>Phone Number:</strong> {{ contact.phoneNumber }}</p>
              </div>
              <div v-if="isEditing">
                <button
                  @click="deleteContact(index)"
                  class="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- Add New Contact Form -->
        <div
          v-if="isAddingNewContact"
          class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-teal-500"
        >
          <h3 class="text-lg font-semibold text-teal-500 mb-2">
            Add New Contact
          </h3>
          <form @submit.prevent="submitNewContact">
            <div class="flex gap-2">
              <input
                v-model="newContactName"
                type="text"
                placeholder="Name"
                class="p-2 border border-teal-500 rounded-lg w-1/2"
                required
              />
              <input
                v-model="newContactPhoneNumber"
                type="text"
                placeholder="Phone Number"
                class="p-2 border border-teal-500 rounded-lg w-1/2"
                required
              />
            </div>
            <div class="flex justify-end flex-row">
              <button
                type="submit"
                class="mt-2 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
              >
                Add Contact
              </button>
              <button
                @click="cancelNewContact"
                type="button"
                class="mt-2 bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 ml-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <div v-if="!isAddingNewContact" class="flex justify-center">
          <button
            @click="startAddingNewContact"
            class="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 mt-4"
          >
            Add New Contact
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EmergencyContact } from "@/interfaces";
import { usePatientStore } from "@/stores/patient";
import { computed, ref } from "vue";

interface PatientDetailsFields {
  Name: string;
  Email: string;
  "Phone Number": string;
  "Date of Birth": string;
  Gender: string;
  Address: string;
}

const patientStore = usePatientStore();
const userID = patientStore.getUserID;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const patient = computed(() => patientStore.getPatient);

const patientDetails = computed<PatientDetailsFields>(() => ({
  Name: patient.value.name,
  Email: patient.value.email,
  "Phone Number": patient.value.phoneNumber,
  "Date of Birth": formatDate(patient.value.dateOfBirth),
  Gender: patient.value.gender,
  Address: patient.value.address || "",
}));

const isEditing = ref(false);
const isAddingNewContact = ref(false);
const activeTab = ref<"profile" | "contacts">("profile");

const editableFields = ref<Partial<PatientDetailsFields>>({
  Name: patient.value.name,
  Email: patient.value.email,
  "Phone Number": patient.value.phoneNumber,
  "Date of Birth": formatDate(patient.value.dateOfBirth),
  Gender: patient.value.gender,
  Address: patient.value.address,
});

const newContactName = ref("");
const newContactPhoneNumber = ref("");

const isEditableField = (key: keyof PatientDetailsFields): boolean => {
  return !["Medical History", "Allergies", "Chronic Conditions"].includes(key);
};

const toggleEditMode = (): void => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    cancelChanges();
  }
};

const saveChanges = async (): Promise<void> => {
  const updatedData = {
    name: editableFields.value.Name || patient.value.name,
    email: editableFields.value.Email || patient.value.email,
    phoneNumber:
      editableFields.value["Phone Number"] || patient.value.phoneNumber,
    dateOfBirth:
      editableFields.value["Date of Birth"] || patient.value.dateOfBirth,
    gender: editableFields.value.Gender || patient.value.gender,
    address: editableFields.value.Address || patient.value.address,
    emergencyContact: patient.value.emergencyContact,
  };

  console.log("User ID:", userID);
  console.log("Updated data:", updatedData);

  if (userID) {
    await patientStore.updatePatientDetails(userID, updatedData);
    await patientStore.fetchPatient(userID);
    isEditing.value = false;
  }
};

const cancelChanges = (): void => {
  Object.keys(editableFields.value).forEach((key) => {
    const fieldKey = key as keyof PatientDetailsFields;
    editableFields.value[fieldKey] = patientDetails.value[fieldKey];
  });
  patientStore.fetchPatient(userID);
};

const startAddingNewContact = (): void => {
  isAddingNewContact.value = true;
};

const cancelNewContact = (): void => {
  newContactName.value = "";
  newContactPhoneNumber.value = "";
  isAddingNewContact.value = false;
};

const submitNewContact = async (): Promise<void> => {
  if (newContactName.value && newContactPhoneNumber.value) {
    const newContact: EmergencyContact = {
      name: newContactName.value,
      phoneNumber: newContactPhoneNumber.value,
    };
    patient.value.emergencyContact = patient.value.emergencyContact || [];
    patient.value.emergencyContact.push(newContact);

    if (userID) {
      await patientStore.updatePatientDetails(userID, {
        emergencyContact: patient.value.emergencyContact,
      });
    }

    newContactName.value = "";
    newContactPhoneNumber.value = "";
    isAddingNewContact.value = false;
  }
};

const deleteContact = (index: number): void => {
  if (confirm("Are you sure you want to delete this contact?")) {
    patient.value.emergencyContact?.splice(index, 1);
  }
};
</script>

<style scoped></style>
