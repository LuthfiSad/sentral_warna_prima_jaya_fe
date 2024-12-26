export const CONFIG_APP = {
  APP_NAME: import.meta.env.APP_NAME,
  BASE_URL: import.meta.env.APP_BASE_URL,
};

export const API_ENDPOINT = {
  login: `${CONFIG_APP.BASE_URL}/auth/login`,
  check: `${CONFIG_APP.BASE_URL}/auth/check-token`,
  ont: `${CONFIG_APP.BASE_URL}/onts`,
  stb: `${CONFIG_APP.BASE_URL}/stbs`,
  location: `${CONFIG_APP.BASE_URL}/locations`,
  cable: `${CONFIG_APP.BASE_URL}/cables`,
  inventory: `${CONFIG_APP.BASE_URL}/inventories`,
  export: `${CONFIG_APP.BASE_URL}/exports`,
  history: `${CONFIG_APP.BASE_URL}/histories`,
};
