export const CONFIG_APP = {
  APP_NAME: import.meta.env.APP_NAME,
  BASE_URL: import.meta.env.APP_BASE_URL,
};

export const API_ENDPOINT = {
  login: `${CONFIG_APP.BASE_URL}/users/auth/login`,
  register: `${CONFIG_APP.BASE_URL}/users/auth/register`,
  check: `${CONFIG_APP.BASE_URL}/users/check`,
  user: `${CONFIG_APP.BASE_URL}/users`,
};
