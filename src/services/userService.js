import apiClient from "./apiClient";

export const login = ({ email, password }) => {
  return apiClient
    .post("/login", { email, password })
    .then((response) => response.data);
};

export const register = (userDTO) => {
  return apiClient.post("/register", userDTO).then((response) => response.data);
};
