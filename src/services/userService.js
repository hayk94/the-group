import apiClient from "./apiClient";

export const login = ({ email, password }) => {
  return apiClient
    .post("/login", { email, password })
    .then((response) => response.data);
};
