const ENV = process.env.ENV;

const API_CONFIG = {
  development: {
    BASE_URL: process.env.DEV_BASE_URL,
    AUTH_URL: process.env.DEV_AUTH_URL,
    PROJECT_URL: process.env.DEV_PROJECT_URL,
    WORK_URL: process.env.DEV_WORK_URL,
    SUB_WORK_URL: process.env.DEV_SUB_WORK_URL,
  },
  staging: {
    BASE_URL: process.env.STAGING_BASE_URL,
    AUTH_URL: process.env.STAGING_AUTH_URL,
    PROJECT_URL: process.env.STAGING_PROJECT_URL,
    WORK_URL: process.env.STAGING_WORK_URL,
    SUB_WORK_URL: process.env.STAGING_SUB_WORK_URL,
  },
  production: {
    BASE_URL: process.env.PROD_BASE_URL,
    AUTH_URL: process.env.PROD_AUTH_URL,
    PROJECT_URL: process.env.PROD_PROJECT_URL,
    WORK_URL: process.env.PROD_WORK_URL,
    SUB_WORK_URL: process.env.PROD_SUB_WORK_URL,
  },
};

export const {
  BASE_URL,
  AUTH_URL,
  PROJECT_URL,
  WORK_URL,
  SUB_WORK_URL,
} = API_CONFIG[ENV];
