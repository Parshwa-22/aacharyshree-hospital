import apiClient from "./client";

export async function login(username, password) {
  const { data } = await apiClient.post("/api/auth/login", { username, password });
  return data; // { token, username, role, expiresInMs }
}

export async function register(username, email, password, registrationSecret) {
  const { data } = await apiClient.post("/api/auth/register", {
    username,
    email,
    password,
    registrationSecret,
  });
  return data;
}
