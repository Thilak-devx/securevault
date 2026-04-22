import { api } from "./api";

export function deleteAccountRequest() {
  return api.delete("/delete-account");
}
