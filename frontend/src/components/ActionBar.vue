<template>
  <div class="row items-center q-gutter-sm q-mb-md">
    <q-btn
      unelevated
      icon="refresh"
      color="white"
      text-color="black"
      class="btn-shadow q-px-sm"
      @click="onRefresh"
    />

    <q-btn
      unelevated
      no-caps
      icon="mail"
      label="GET NEW EMAILS"
      color="white"
      text-color="black"
      class="btn-shadow q-px-md"
      @click="onGetNew"
    />

    <q-btn
      unelevated
      no-caps
      icon="send"
      label="SEND ALL DRAFTS"
      color="white"
      text-color="black"
      class="btn-shadow q-px-md"
      @click="onSendAll"
    />
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["refresh", "get-new", "send-all"]);
const props = defineProps({
  type: { type: String, required: true },
});

function onRefresh() {
  emit("refresh", props.type);
}
function onGetNew() {
  emit("get-new", props.type);
}
function onSendAll() {
  emit("send-all", props.type);
}
</script>

<style scoped>
.btn-shadow {
  margin-right: 40px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
