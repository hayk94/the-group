export const setAuthTokensToLocalStorage = (tokens) => {
  Object.keys(tokens).forEach((key) => {
    localStorage.setItem(key, tokens[key]);
  });
};

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem("accessToken");
};
