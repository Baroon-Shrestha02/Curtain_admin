import api from "./BaseApi";

// POST /auth/login
export const login = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { status, message, token, user }
};

// GET /auth/logged-user
export const getLoggedUser = async () => {
  const { data } = await api.get("/auth/logged-user");
  return data.user;
};

// POST /auth/logout (server is stateless; we clear client token regardless)
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore network/401 — we still clear locally
  }
};

// PATCH /auth/change-password
export const changePassword = async ({
  currentPassword,
  password,
  confirmPassword,
}) => {
  const { data } = await api.patch("/auth/change-password", {
    currentPassword,
    password,
    confirmPassword,
  });
  return data;
};
