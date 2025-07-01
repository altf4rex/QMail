<template>
  <q-dialog
    :model-value="props.modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <q-card class="q-pa-md" style="max-width: 600px; width: 100%">
      <q-card-section>
        <div class="text-h6">New Message</div>
      </q-card-section>

      <q-card-section class="q-gutter-y-md">
        <q-input v-model="dto.to_email" label="To" outlined dense />
        <q-input v-model="dto.subject" label="Subject" outlined dense />
        <q-input
          v-model="dto.body"
          label="Body"
          type="textarea"
          outlined
          dense
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="onCancel" />
        <q-btn color="primary" flat label="💾 SAVE TO DRAFTS" @click="onSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits, reactive } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
});
const emit = defineEmits(["save", "update:modelValue"]);

const dto = reactive({
  from_email: "me@mail.com",
  to_email: "",
  subject: "",
  body: "",
});

function onSave() {
  emit("save", { ...dto });
}

function onCancel() {
  emit("update:modelValue", false);
}
</script>
