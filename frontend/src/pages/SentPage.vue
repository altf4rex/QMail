<template>
  <q-page padding>
    <ActionBar
      type="sent"
      @refresh="() => loadSent(props.searchQuery)"
      @get-new="() => loadSent(props.searchQuery)"
      @send-all="() => {}"
    />

    <MailList :mails="store.emails" type="sent" @view="onView" />

    <MailViewModal
      v-model:modelValue="showView"
      :email="store.currentEmail"
      @back="onBack"
      @delete="onDelete"
    />

    <ComposeModal v-model:modelValue="showCompose" @save="onSaveDraft" />
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useMailStore } from "stores/mail.store";
import ActionBar from "components/ActionBar.vue";
import MailList from "components/MailList.vue";
import MailViewModal from "components/MailViewModal.vue";
import ComposeModal from "components/ComposeModal.vue";

const props = defineProps({ searchQuery: String });
const store = useMailStore();
const showView = ref(false);
const showCompose = ref(false);

function loadSent(q = props.searchQuery) {
  store.load("sent", q);
}

async function onView(id) {
  await store.view(id, "sent");
  showView.value = true;
}

function onSaveDraft(dto) {
  store.saveDraft(dto).then(() => {
    showCompose.value = false;
  });
}

function onBack() {
  showView.value = false;
}

function onDelete() {
  if (!store.currentEmail) return;
  store.remove(store.currentEmail.id, "sent");
  showView.value = false;
}

window.addEventListener("open-compose", () => {
  showCompose.value = true;
});

onMounted(() => loadSent());
watch(
  () => props.searchQuery,
  (q) => loadSent(q)
);
</script>