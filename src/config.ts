/**
 * При разработке не имеем доступ к протоколу, хосту и всему прочему, если не хардкод
 */
const PROTO = window.location.protocol;
const HOST = window.location.host;
const PATHNAME = window.location.pathname;

const STAND = process.env.STAND;

const host_dev = {
  dev: 'dev-ets.gost-group.com/',
  gost_stage: 'ets-stage.gost-group.com/',
  ets_test: 'ets-test.mos.ru/',
  ets_hotfix: 'ets-hotfix.mos.ru/',
  prod: 'ets.mos.ru/',
};

const hostPathName = {
  develop: host_dev[STAND],
  origin: `${HOST}${PATHNAME}`,
};

const urls = {
  develop: `https://${hostPathName.develop}`,
  origin: `${PROTO}//${hostPathName.origin}`,
};

const ADMIN_URL = {
  develop: `${urls.develop}admin`,
  origin: `${urls.origin}admin/`,
};

const DOC_URL = {
  develop: `${urls.develop}docs/`,
  origin: `${urls.origin}docs/`,
};

const IMAGE_URL = {
  develop: `${urls.develop}ets/data/images/`,
  origin: `${urls.origin}ets/data/images/`,
};

const config = {
  develop: {
    images: IMAGE_URL.develop,
    docs: DOC_URL.develop,
    admin: ADMIN_URL.develop,
  },
  origin: {
    images: IMAGE_URL.origin,
    docs: DOC_URL.origin,
    admin: ADMIN_URL.origin,
  },
};

export const configApi = {
  develop: `${urls.develop}services`,
  origin: `${urls.origin}services`,
};

const notification_config = {
  develop: `wss://${hostPathName.develop}services/notification_ws`,
  origin: `wss//${hostPathName.origin}services/notification_ws`,
};

const configs = {
  url: urls.develop,
  images: config.develop.images,
  docs: config.develop.docs,
  admin: config.develop.admin,
  backend: configApi.develop,
  notification_ws: notification_config.develop,
  tracksCaching: `https://psd.mos.ru/tracks-caching${
    STAND !== 'prod' ? '-dev' : ''
  }`,
};
const pathToConfig = __DEVELOPMENT__ ? 'develop' : 'origin';

try {
  configs.url = urls[pathToConfig];
  configs.images = config[pathToConfig].images;
  configs.docs = config[pathToConfig].docs;
  configs.admin = config[pathToConfig].admin;
  configs.backend = configApi[pathToConfig];
  configs.notification_ws = notification_config[pathToConfig];
} catch (e) {
  // tslint:disable-next-line
  console.warn(e);
}

export default configs;
