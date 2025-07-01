import { api } from "boot/axios";

export async function fetchEmails(type, search = "") {
  const params = { type };
  if (search) params.search = search;
  const { data } = await api.get("/emails", { params });
  return data;
}

export async function fetchNewEmails() {
  const { data } = await api.get("/emails/new");
  return data;
}

export async function fetchEmail(id, type) {
  const { data } = await api.get(`/emails/${id}`, { params: { type } });
  return data;
}

export async function deleteEmail(id, type) {
  await api.delete(`/emails/${id}`, { params: { type } });
}

export async function saveDraft(dto) {
  const { data } = await api.post("/emails", dto, {
    params: { type: "draft" },
  });
  return data;
}

export async function updateDraft(id, dto) {
  const { data } = await api.put(`/emails/${id}`, dto, {
    params: { type: "draft" },
  });
  return data;
}

export async function fetchSent() {
  const { data } = await api.get("/emails", { params: { type: "sent" } });
  return data;
}

export async function markAsRead(id) {
  const { data } = await api.patch(`/emails/${id}/read`);
  return data;
}

export async function sendDraft(id) {
  const { data } = await api.patch(`/emails/${id}/send`);
  return data;
}

export async function sendAllDrafts() {
  const { data } = await api.post("/emails/send-all");
  return data;
}
