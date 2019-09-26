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

const pathToConfig = __DEVELOPMENT__ ? 'develop' : 'origin';

const ADMIN_URL = `${urls[pathToConfig]}admin`;
const DOC_URL = `${urls[pathToConfig]}docs/`;
const IMAGE_URL = `${urls[pathToConfig]}ets/data/images/`;
export const configApi = `${urls[pathToConfig]}services`;
const notification_config = `wss://${hostPathName[pathToConfig]}services/notification_ws`;
const tracksCaching = `https://psd.mos.ru/tracks-caching${STAND !== 'prod' ? '-dev' : ''}`;

const configs = {
  url: urls[pathToConfig],
  images: IMAGE_URL,
  docs: DOC_URL,
  admin: ADMIN_URL,
  backend: configApi,
  notification_ws: notification_config,
  tracksCaching,
};

export default configs;
