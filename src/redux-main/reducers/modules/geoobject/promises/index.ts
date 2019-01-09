import { GeozonesService } from 'api/Services';
import { get } from 'lodash';
import GEOOBJECT from 'redux-main/reducers/modules/geoobject/constants';

/* ------------- GEOOBJECT ------------- */
export const geoobjectLoadByType = (keyType: keyof typeof GEOOBJECT) => (payload = {}) => (
  GeozonesService.path(GEOOBJECT[keyType]).get({ ...payload })
    .catch((error) => {
      console.log(error); // tslint:disable-line
    })
    .then((ans) => {
      const data = get(ans, ['result', 'rows'], []).map((geom) => {
        try {
          geom.shape = JSON.parse(geom.shape);
        } catch (e) {
          geom.shape = geom.shape || null;
        }

        return geom;
      });

      return {
        data,
        extraData: get(ans, ['result', 'extra'], {}),
      };
    })
);
export const geoobjectCreateByType = (keyType: keyof typeof GEOOBJECT) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return GeozonesService.path(GEOOBJECT[keyType]).post(
    payload,
    false,
    'json',
  );
};
export const geoobjectUpdateByType = (keyType: keyof typeof GEOOBJECT) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return GeozonesService.path(GEOOBJECT[keyType]).path(ownPayload.id).put(
    payload,
    false,
    'json',
  );
};
export const geoobjectRemoveByType = (keyType: keyof typeof GEOOBJECT) => (id: number) => {
  return GeozonesService.path(`${GEOOBJECT[keyType]}/${id}`).delete(
    {},
    false,
    'json',
  ).then(() => {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  });
};
