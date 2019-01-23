import {
  GeozonesService,
  GormostService,
} from 'api/Services';
import { get } from 'lodash';
import { geoozones, gormost } from 'redux-main/reducers/modules/geoobject/constants';

/* ------------- geoozones ------------- */
export const geoozonesLoadByType = (keyType: keyof typeof geoozones) => (payload = {}) => (
  GeozonesService.path(geoozones[keyType]).get({ ...payload })
    .catch((error) => {
      console.log(error); // tslint:disable-line:no-console
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
export const geoozonesCreateByType = (keyType: keyof typeof geoozones) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return GeozonesService.path(geoozones[keyType]).post(
    payload,
    false,
    'json',
  );
};

export const geoozonesUpdateByTypeOld = (keyType: keyof typeof geoozones) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return GeozonesService.path(geoozones[keyType]).put(
    payload,
    false,
    'json',
  );
};
export const geoozonesUpdateByType = (keyType: keyof typeof geoozones) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return GeozonesService.path(geoozones[keyType]).path(ownPayload.id).put(
    payload,
    false,
    'json',
  );
};
export const geoozonesRemoveByType = (keyType: keyof typeof geoozones) => (id: number) => {
  return GeozonesService.path(`${geoozones[keyType]}/${id}`).delete(
    {},
    false,
    'json',
  ).then(() => {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  });
};

/* ------------- gormost ------------- */
export const gormostLoadByType = (keyType: keyof typeof gormost) => (payload = {}) => (
  GormostService.path(gormost[keyType]).get({ ...payload })
    .catch((error) => {
      console.log(error); // tslint:disable-line:no-console
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
export const gormostCreateByType = (keyType: keyof typeof gormost) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return GormostService.path(gormost[keyType]).post(
    payload,
    false,
    'json',
  );
};

export const gormostUpdateByTypeOld = (keyType: keyof typeof gormost) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return GormostService.path(gormost[keyType]).put(
    payload,
    false,
    'json',
  );
};
export const gormostUpdateByType = (keyType: keyof typeof gormost) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return GormostService.path(gormost[keyType]).path(ownPayload.id).put(
    payload,
    false,
    'json',
  );
};
export const gormostRemoveByType = (keyType: keyof typeof gormost) => (id: number) => {
  return GormostService.path(`${gormost[keyType]}/${id}`).delete(
    {},
    false,
    'json',
  ).then(() => {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  });
};
