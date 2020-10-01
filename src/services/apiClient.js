import axios from "axios";

const BASE_URL = "/";

let apiClient;

apiClient = axios.create({
  baseURL: BASE_URL,
});

export default apiClient;

export const setAuthTokens = (tokens) => {
  const { accessToken } = tokens;
  apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
