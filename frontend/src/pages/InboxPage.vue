<template>
  <q-page padding>
    <ActionBar
      type="inbox"
      @refresh="() => loadInbox(props.searchQuery)"
      @get-new="loadNew"
      @send-all="() => {}"
    />

    <MailList :mails="store.emails" type="inbox" @view="onView" />

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

function loadInbox(q = props.searchQuery) {
  store.load("inbox", q);
}

async function loadNew() {
  await store.loadNew();
}

async function onView(id) {
  await store.view(id, "inbox");
  await store.markAsRead(id);
  showView.value = true;
}

function onDelete() {
  store.remove(store.currentEmail.id, "inbox");
  showView.value = false;
}

function onSaveDraft(dto) {
  store.saveDraft(dto).then(() => {
    showCompose.value = false;
  });
}

function onBack() {
  showView.value = false;
}

window.addEventListener("open-compose", () => {
  showCompose.value = true;
});

onMounted(() => loadInbox());
watch(
  () => props.searchQuery,
  (q) => loadInbox(q)
);
</script>