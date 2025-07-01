<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="q-pa-none"
    >
      <div class="text-grey-6 text-subtitle2 q-pa-md">QMail</div>
      <q-list class="q-pt-none">
        <q-item
          clickable
          v-ripple
          to="/"
          exact
          active-class="bg-primary text-white"
        >
          <q-item-section avatar><q-icon name="mail" /></q-item-section>
          <q-item-section>Inbox</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          to="/drafts"
          exact
          active-class="bg-primary text-white"
        >
          <q-item-section avatar><q-icon name="drafts" /></q-item-section>
          <q-item-section>Drafts</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          to="/sent"
          exact
          active-class="bg-primary text-white"
        >
          <q-item-section avatar><q-icon name="send" /></q-item-section>
          <q-item-section>Sent</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-header elevated>
      <q-toolbar class="items-center q-gutter-sm">
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Toggle drawer"
        />
        <q-toolbar-title class="text-h6">QMail</q-toolbar-title>
        <q-space />

        <SearchBar @update="onSearchGlobal" />
      </q-toolbar>
    </q-header>

    <q-page-container class="relative-position">
      <router-view :search-query="searchQuery" />
      <q-btn
        fab
        icon="edit"
        color="primary"
        class="absolute-bottom-right q-ma-md"
        @click="emitCompose"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import SearchBar from "components/SearchBar.vue";

const leftDrawerOpen = ref(false);
const searchQuery = ref("");

function onSearchGlobal(q) {
  searchQuery.value = q;
}

function emitCompose() {
  window.dispatchEvent(new Event("open-compose"));
}
</script>
