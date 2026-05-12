import axios from "axios";

// Centralized API client. Add new endpoint functions below.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

export async function getHealth() {
  const { data } = await api.get("/health");
  return data;
}
