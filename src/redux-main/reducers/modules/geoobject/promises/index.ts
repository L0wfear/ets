import {
  GeozonesService,
  GormostService,
  GeozoneMunicipalFacilityService,
} from 'api/Services';
import { get } from 'lodash';
import { geoozones, gormost } from 'redux-main/reducers/modules/geoobject/constants';
import { GeoobjsFilterByElemOptions } from '../@types/geoobject.h';

export const makeShape = <F extends any>(geomOwn: F) => {
  const geom = { ...geomOwn };
  try {
    geom.shape = JSON.parse(geom.shape);
  } catch (e) {
    geom.shape = geom.shape || null;
  }

  return geom;
};

/* ------------- geoozones ------------- */
export const geoozonesLoadByType = <F extends any, ExtraData extends any = any>(keyType: keyof typeof geoozones) => async (payload = {}) => {
  let response = null;

  try {
    response = await GeozonesService.path(geoozones[keyType]).get({ ...payload });
  } catch {
    //
  }

  const data: Array<F> = get(response, 'result.rows', []).map(makeShape);
  const extraData: ExtraData = get(response, 'result.extra', {});

  return {
    data,
    extraData,
  };
};

export const promiseGeozonesLoadPFByType = (keyType: keyof typeof geoozones) => (payload = {}) => (
  GeozonesService.path(geoozones[keyType]).getBlob({ ...payload })
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

export const promiseGetGeoobjsFilterByElem = async (options: GeoobjsFilterByElemOptions): Promise<Array<number>> => {
  const response = await GeozoneMunicipalFacilityService.get(options);
  
  const result: Array<number> = get(response, 'result').map((el) => el.id);

  return result;
};
/* ------------- gormost ------------- */
export const gormostLoadByType = <F extends any, ExtraData extends any = any>(keyType: keyof typeof gormost) => async (payload = {}) => {
  let response = null;

  try {
    response = await GormostService.path(gormost[keyType]).get({ ...payload });
  } catch {
    //
  }

  const data: Array<F> = get(response, 'result.rows', []).map(makeShape);
  const extraData: ExtraData = get(response, 'result.extra', {});

  return {
    data,
    extraData,
  };
};
export const promiseGormostLoadPFByType = (keyType: keyof typeof gormost) => (payload = {}) => (
  GormostService.path(gormost[keyType]).getBlob({ ...payload })
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
