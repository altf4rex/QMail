<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <q-card class="q-pa-md" style="max-width: 500px; width: 100%">
      <q-card-section>
        <div class="text-h6">{{ email?.subject }}</div>
        <div class="text-subtitle2">
          <span v-if="email?.type === 'draft'">To: {{ email.to_email }}</span>
          <span v-else>From: {{ email.from_email }}</span>
        </div>
        <div class="text-caption">{{ email?.created_at }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <p>{{ email?.body }}</p>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn
          v-if="email?.type === 'draft'"
          color="secondary"
          flat
          label="Send"
          @click="emit('send')"
        />
        <div class="row q-gutter-sm">
          <q-btn flat label="Back" @click="onBack" />
          <q-btn flat color="negative" label="Delete" @click="emit('delete')" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  email: { type: Object, default: null },
});
const emit = defineEmits(["update:modelValue", "back", "delete", "send"]);

function onBack() {
  emit("update:modelValue", false);
  emit("back");
}
</script>