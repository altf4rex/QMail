<template>
  <q-page padding>
    <ActionBar
      type="draft"
      @refresh="() => loadDrafts(props.searchQuery)"
      @get-new="() => loadDrafts(props.searchQuery)"
      @send-all="onSendAllDrafts"
    />

    <MailList :mails="store.emails" type="draft" @view="onView" />

    <MailViewModal
      v-model:modelValue="showView"
      :email="store.currentEmail"
      @back="onBack"
      @delete="onDelete"
      @send="onSendOne"
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

function loadDrafts(q = props.searchQuery) {
  store.load("draft", q);
}

async function onView(id) {
  await store.view(id, "draft");
  showView.value = true;
}

function onSendOne() {
  store.sendDraft(store.currentEmail.id).then(() => {
    showView.value = false;
    loadDrafts();
  });
}

function onDelete() {
  store.remove(store.currentEmail.id, "draft");
  showView.value = false;
}

function onSaveDraft(dto) {
  store.saveDraft(dto).then(() => {
    showCompose.value = false;
    loadDrafts();
  });
}

async function onSendAllDrafts() {
  await store.sendAllDrafts();
  loadDrafts();
}

function onBack() {
  showView.value = false;
}

window.addEventListener("open-compose", () => {
  showCompose.value = true;
});

onMounted(() => loadDrafts());
watch(
  () => props.searchQuery,
  (q) => loadDrafts(q)
);
</script>