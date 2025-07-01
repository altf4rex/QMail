import { defineStore } from "pinia";
import {
  fetchEmails,
  fetchNewEmails,
  fetchEmail,
  deleteEmail,
  saveDraft,
  updateDraft,
  fetchSent,
  markAsRead,
  sendDraft,
  sendAllDrafts,
} from "src/services/api";

export const useMailStore = defineStore("mail", {
  state: () => ({
    emails: [],
    currentEmail: null,
    loading: false,
    error: null,
  }),

  actions: {
    async load(type, search = "") {
      this.loading = true;
      try {
        this.emails = await fetchEmails(type, search);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async loadNew() {
      this.loading = true;
      try {
        this.emails = await fetchNewEmails();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async view(id, type) {
      this.loading = true;
      try {
        console.log("store.view", id, type);
        this.currentEmail = await fetchEmail(id, type);
        console.log("fetched email", this.currentEmail);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async remove(id, type) {
      try {
        await deleteEmail(id, type);
        this.emails = this.emails.filter((e) => e.id !== id);
      } catch (e) {
        this.error = e.message;
      }
    },

    async saveDraft(dto) {
      try {
        const e = await saveDraft(dto);
        this.emails.unshift(e);
        return e;
      } catch (e) {
        this.error = e.message;
      }
    },

    async updateDraft(id, dto) {
      try {
        const e = await updateDraft(id, dto);
        const idx = this.emails.findIndex((x) => x.id === id);
        if (idx !== -1) this.emails.splice(idx, 1, e);
        return e;
      } catch (e) {
        this.error = e.message;
      }
    },

    async loadSent() {
      this.loading = true;
      try {
        this.emails = await fetchSent();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(id) {
      try {
        const e = await markAsRead(id);
        const idx = this.emails.findIndex((x) => x.id === id);
        if (idx !== -1) this.emails.splice(idx, 1, e);
      } catch (e) {
        this.error = e.message;
      }
    },

    async sendDraft(id) {
      try {
        await sendDraft(id);
        this.emails = this.emails.filter((e) => e.id !== id);
      } catch (e) {
        this.error = e.message;
      }
    },

    async sendAllDrafts() {
      try {
        await sendAllDrafts();
        this.emails = this.emails.filter((e) => e.type !== "draft");
      } catch (e) {
        this.error = e.message;
      }
    },
  },
});
