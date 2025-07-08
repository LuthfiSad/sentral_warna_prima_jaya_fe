export const CONFIG_APP = {
  APP_NAME: import.meta.env.APP_NAME,
  BASE_URL: `${window.location.protocol}//${window.location.hostname}/api`,
  OFFICE_LATITUDE: import.meta.env.OFFICE_LATITUDE,
  OFFICE_LONGITUDE: import.meta.env.OFFICE_LONGITUDE,
};


export const API_ENDPOINT = {
  login: `${CONFIG_APP.BASE_URL}/users/auth/login`,
  register: `${CONFIG_APP.BASE_URL}/users/auth/register`,
  check: `${CONFIG_APP.BASE_URL}/users/check`,
  user: `${CONFIG_APP.BASE_URL}/users`,
  employee: `${CONFIG_APP.BASE_URL}/employees`,
  report: `${CONFIG_APP.BASE_URL}/reports`,
  attendance: `${CONFIG_APP.BASE_URL}/attendances`,
};