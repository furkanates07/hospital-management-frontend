<template>
  <div
    v-if="isVisible"
    class="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-teal-500"
  >
    <h3 class="text-lg font-semibold text-teal-500 mb-2">Add New Contact</h3>
    <form @submit.prevent="submit">
      <div class="flex gap-2">
        <input
          :value="newContactName"
          @input="updateNewContactName"
          type="text"
          placeholder="Name"
          class="p-2 border border-teal-500 rounded-lg w-1/2"
          required
        />
        <div class="w-1/2">
          <input
            :value="formattedPhoneNumber"
            @input="updateNewContactPhoneNumber"
            type="text"
            placeholder="Phone Number"
            class="p-2 border border-teal-500 rounded-lg w-full"
            required
          />
        </div>
      </div>
      <p
        v-if="phoneNumberError"
        class="flex justify-center text-red-500 text-sm mt-1"
      >
        Invalid phone number format.
      </p>
      <div class="flex justify-end flex-row">
        <button
          type="submit"
          class="mt-2 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
        >
          Add Contact
        </button>
        <button
          @click="cancel"
          type="button"
          class="mt-2 bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 ml-2"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref } from "vue";

const props = defineProps<{
  isVisible: boolean;
  newContactName: string;
  newContactPhoneNumber: string;
}>();

const emit = defineEmits<{
  (event: "submit-new-contact"): void;
  (event: "cancel-new-contact"): void;
  (event: "update-new-contact-name", name: string): void;
  (event: "update-new-contact-phone-number", phoneNumber: string): void;
}>();

const phoneNumberError = ref(false);

const formattedPhoneNumber = computed(() => {
  const rawNumber = props.newContactPhoneNumber.replace(/\s+/g, "");
  return rawNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
});

const updateNewContactName = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update-new-contact-name", target.value);
};

const updateNewContactPhoneNumber = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const rawPhoneNumber = target.value.replace(/\s+/g, "");
  emit("update-new-contact-phone-number", rawPhoneNumber);

  phoneNumberError.value = !validatePhoneNumber(rawPhoneNumber);
};

const submit = () => {
  if (!phoneNumberError.value) {
    emit("submit-new-contact");
  }
};

const cancel = () => {
  emit("cancel-new-contact");
};

const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phoneNumber);
};
</script>
