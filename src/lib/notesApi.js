import { api, performApiRequest } from "./api";

export async function getNotes() {
  return performApiRequest(() => api.get("/notes"));
}

export async function createNote(payload) {
  return performApiRequest(() => api.post("/notes", payload));
}

export async function updateNote(noteId, payload) {
  return performApiRequest(() => api.put(`/notes/${noteId}`, payload));
}

export async function deleteNote(noteId) {
  return performApiRequest(() => api.delete(`/notes/${noteId}`));
}

export async function unlockNote(noteId, password) {
  return performApiRequest(() => api.post(`/notes/unlock/${noteId}`, { password }));
}

export async function resetNotePassword(noteId, payload) {
  return performApiRequest(() => api.post(`/notes/reset-lock/${noteId}`, payload));
}
