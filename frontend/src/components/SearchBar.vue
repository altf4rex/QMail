<template>
  <div class="search-wrapper">
    <q-input
      dense
      v-model="model"
      placeholder="Search mail"
      clearable
      @clear="onClear"
      @update:model-value="onInput"
      class="bg-white no-underline q-px-sm rounded-borders"
      input-class="pl-8 pr-2"
    >
      <template #before>
        <q-icon
          name="search"
          class="q-mr-sm text-grey cursor-pointer"
          @click="onSearch"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["update"]);

const model = ref("");

function onClear() {
  model.value = "";
  emit("update", "");
}

function onSearch() {
  emit("update", model.value.trim());
}

function onInput(val) {
  emit("update", val);
}
</script>

<style scoped>
.search-wrapper {
  margin: 12px 0 6px 0;
  width: 100%;
  max-width: 350px;
}

.no-underline {
  border: none !important;
  outline: none;
}
.q-px-sm {
  padding-right: 8px;
  padding-left: 6px;
}
.rounded-borders {
  border-radius: 32px;
}
</style>
