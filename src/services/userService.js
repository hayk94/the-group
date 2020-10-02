import apiClient from "./apiClient";

const USERS_BASE_URL = `/users`;

export const loginUser = ({ email, password }) => {
  return apiClient
    .post("/login", { email, password })
    .then((response) => response.data);
};
export const registerUser = (userDTO) => {
  return apiClient.post("/register", userDTO).then((response) => response.data);
};
export const updateUserProfile = (profileDTO) => {
  const { id } = profileDTO;
  return apiClient
    .patch(`${USERS_BASE_URL}/${id}`, profileDTO)
    .then((response) => response.data);
};

export const getUser = (key, id) => {
  return apiClient
    .get(`${USERS_BASE_URL}/${id}`)
    .then((response) => response.data);
};

export const getUserList = () => {
  return apiClient.get(`${USERS_BASE_URL}`).then((response) => response.data);
};
