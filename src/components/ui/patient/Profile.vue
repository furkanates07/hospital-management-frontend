<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-4">
    <div class="w-full max-w-2xl relative">
      <ProfileHeader
        :isEditing="isEditing"
        @save="saveChanges"
        @toggleEditMode="toggleEditMode"
      />

      <TabsNavigation
        :activeTab="activeTab"
        @changeTab="(tab) => (activeTab = tab)"
      />

      <ProfileContent
        :activeTab="activeTab"
        :patientDetails="patientDetails"
        :editableFields="editableFields"
        :isEditing="isEditing"
        :isEditableField="isEditableField"
        :currentDate="currentDate"
      />
      <PasswordChange
        :activeTab="activeTab"
        :isChangingPassword="isChangingPassword"
        :changePassword="changePassword"
        :toggleChangePasswordForm="toggleChangePasswordForm"
        :changePasswordHandler="changePasswordHandler"
        :cancelPasswordChange="cancelPasswordChange"
        :patientStore="patientStore"
      />

      <div v-if="activeTab === 'contacts'">
        <EmergencyContactsList
          :contacts="patient.emergencyContact"
          :isEditing="isEditing"
          @delete-contact="deleteContact"
        />
        <AddNewContactForm
          :isVisible="isAddingNewContact"
          :newContactName="newContactName"
          :newContactPhoneNumber="newContactPhoneNumber"
          @submit-new-contact="submitNewContact"
          @cancel-new-contact="cancelNewContact"
          @update-new-contact-name="newContactName = $event"
          @update-new-contact-phone-number="newContactPhoneNumber = $event"
        />

        <AddNewContactButton
          :isVisible="isAddingNewContact"
          @start-adding-new-contact="startAddingNewContact"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChangePassword, EmergencyContact } from "@/interfaces";
import { usePatientStore } from "@/stores/patient";
import { computed, ref } from "vue";
import AddNewContactButton from "./profile/AddNewContactButton.vue";
import AddNewContactForm from "./profile/AddNewContactForm.vue";
import EmergencyContactsList from "./profile/EmergencyContactsList.vue";
import PasswordChange from "./profile/PasswordChange.vue";
import ProfileContent from "./profile/ProfileContent.vue";
import ProfileHeader from "./profile/ProfileHeader.vue";
import TabsNavigation from "./profile/TabsNavigation.vue";

interface PatientDetailsFields {
  Name: string;
  Email: string;
  "Phone Number": string;
  "Date of Birth": string;
  Address: string;
  Gender: string;
}

const patientStore = usePatientStore();
const userID = patientStore.getUserID;

const activeTab = ref<"profile" | "contacts">("profile");
const isEditing = ref(false);
const isAddingNewContact = ref(false);
const isChangingPassword = ref(false);
const newContactName = ref("");
const newContactPhoneNumber = ref("");
const changePassword = ref<ChangePassword>({
  oldPassword: "",
  newPassword: "",
});

const patient = computed(() => patientStore.getPatient);

const patientDetails = computed<PatientDetailsFields>(() => ({
  Name: patient.value.name,
  Email: patient.value.email,
  "Phone Number": patient.value.phoneNumber,
  "Date of Birth": formatDate(patient.value.dateOfBirth),
  Address: patient.value.address || "",
  Gender: patient.value.gender,
}));

const currentDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const editableFields = ref<Partial<PatientDetailsFields>>({
  Name: patient.value.name,
  Email: patient.value.email,
  "Phone Number": patient.value.phoneNumber,
  "Date of Birth": formatDate(patient.value.dateOfBirth),
  Address: patient.value.address,
});

const isEditableField = (key: string): boolean => {
  return ![
    "Medical History",
    "Allergies",
    "Chronic Conditions",
    "Gender",
  ].includes(key as keyof PatientDetailsFields);
};

const toggleEditMode = (): void => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    cancelChanges();
  }
};

const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phoneNumber);
};

const toggleChangePasswordForm = () => {
  isChangingPassword.value = !isChangingPassword.value;
};

const changePasswordHandler = async (): Promise<void> => {
  if (changePassword.value.oldPassword && changePassword.value.newPassword) {
    await patientStore.changePassword(userID, changePassword.value);
    changePassword.value = { oldPassword: "", newPassword: "" };
    if (!patientStore.getError) {
      isChangingPassword.value = false;
      alert("Password changed successfully!");
    }
  }
};

const cancelPasswordChange = (): void => {
  changePassword.value = { oldPassword: "", newPassword: "" };
  isChangingPassword.value = false;
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
    if (!validatePhoneNumber(newContactPhoneNumber.value)) {
      alert("Invalid phone number format. Please enter a valid phone number.");
      return;
    }

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

const saveChanges = async (): Promise<void> => {
  if (
    editableFields.value["Phone Number"] &&
    !validatePhoneNumber(editableFields.value["Phone Number"])
  ) {
    alert("Invalid phone number format. Please enter a valid phone number.");
    return;
  }

  const updatedData = {
    name: editableFields.value.Name || patient.value.name,
    email: editableFields.value.Email || patient.value.email,
    phoneNumber:
      editableFields.value["Phone Number"] || patient.value.phoneNumber,
    dateOfBirth:
      editableFields.value["Date of Birth"] || patient.value.dateOfBirth,
    gender: patient.value.gender,
    address: editableFields.value.Address || patient.value.address,
    emergencyContact: patient.value.emergencyContact,
  };

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
</script>

<style scoped></style>
