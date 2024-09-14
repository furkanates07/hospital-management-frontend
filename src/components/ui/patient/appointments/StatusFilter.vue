<template>
  <div class="pt-4 flex space-x-4">
    <button
      v-for="stat in ['All', ...status]"
      :key="stat"
      @click="onStatusClick(stat)"
      :class="{
        'bg-teal-500 text-white':
          selectedStatus === stat || (stat === 'All' && !selectedStatus),
        'bg-gray-200 text-gray-700':
          selectedStatus !== stat && !(stat === 'All' && !selectedStatus),
      }"
      class="py-2 px-4 rounded-lg text-sm shadow-md transition-colors"
    >
      {{ stat.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  status: {
    type: Array as () => string[],
    required: true,
  },
  selectedStatus: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["status-change"]);

const onStatusClick = (stat: string) => {
  const newStatus = stat === "All" ? "" : stat;
  emit("status-change", newStatus);
};
</script>
