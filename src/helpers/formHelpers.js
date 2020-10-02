export const formFieldRules = {
  required: "Required",
  maxLength: {
    value: 256,
    message: "Should be less than 256 chars",
  },
};
export const emailFieldRules = {
  ...formFieldRules,
  pattern: {
    value: /[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+\.[a-z0-9-]+/,
    message: "Please enter a valid email",
  },
};
