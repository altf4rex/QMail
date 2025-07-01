<template>
  <q-table
    :rows="mails"
    row-key="id"
    flat
    bordered
    dense
    hide-header
    class="mail-list"
    @row-click="(_, row) => handleClick(row)"
  >
    <template v-slot:body="props">
      <q-tr
        :props="props"
        class="mail-cell"
        :class="{
          'mail-cell--unread': type === 'inbox' && props.row.is_read === 0,
        }"
        @click="handleClick(props.row)"
      >
        <q-td>
          <div class="row items-center no-wrap q-gutter-sm">
            <div class="text-body1 text-weight-bold" style="flex: 2">
              {{ isInbox ? props.row.from_email : props.row.to_email }}
            </div>
            <div class="text-body1" style="flex: 3">
              {{ props.row.subject }}
            </div>
            <div class="text-body2 text-grey" style="flex: 5">
              {{ truncatedBody(props.row.body) }}
            </div>
            <div
              class="text-body2 text-grey"
              style="flex: 2; text-align: right"
            >
              {{ props.row.created_at }}
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  mails: { type: Array, default: () => [] },
  type: { type: String, default: "inbox" },
});
const emit = defineEmits(["view"]);

const isInbox = computed(() => props.type === "inbox");

function truncatedBody(body) {
  if (!body) return "";
  return body.length > 50 ? body.slice(0, 50) + "…" : body;
}

function handleClick(row) {
  console.log("MailList clicked row:", row);
  emit("view", row.id);
}
</script>

<style scoped>
.mail-cell {
  cursor: pointer;
  padding: 8px 16px;
}

.mail-cell--unread {
  font-weight: bold;
  background-color: #f0f8ff;
}
</style>
