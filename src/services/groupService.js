import apiClient from "./apiClient";

const GROUPS_BASE_URL = "/groups";

export const getGroupList = (key, userId) => {
  return apiClient
    .get(`${GROUPS_BASE_URL}?userId=${userId}`)
    .then((response) => response.data);
};

export const getGroup = (key, id) => {
  return apiClient
    .get(`${GROUPS_BASE_URL}/${id}`)
    .then((response) => response.data);
};

export const deleteGroup = (id) => {
  return apiClient
    .delete(`${GROUPS_BASE_URL}/${id}`)
    .then((response) => response.data);
};

export const createGroup = ({ name, userId }) => {
  return apiClient
    .post(GROUPS_BASE_URL, { name, userId })
    .then((response) => response.data);
};

export const updateGroupUsers = ({ groupId, userIds }) => {
  return apiClient
    .patch(`${GROUPS_BASE_URL}/${groupId}`, { userIds })
    .then((response) => response.data);
};
