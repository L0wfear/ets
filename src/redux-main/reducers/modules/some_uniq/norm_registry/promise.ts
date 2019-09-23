import { cloneDeep, get } from 'lodash';
import { isString } from 'util';

import {
  Norm, NormRegistrySensorTypes,
} from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import { CleaningNormRegistryService } from 'api/Services';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';

export const getFrontNorm = (normRaw: any, index) => {
  if (normRaw) {
    const norm: Norm = cloneDeep(normRaw);

    const sensor_types: NormRegistrySensorTypes[] = get(norm, 'sensor_types', []);

    norm.sensor_types_text = sensor_types.reduce(
      (str, { sensor_type_name }: NormRegistrySensorTypes) => {
        return `${str ? `${str}, ` : ''}${sensor_type_name}`;
      },
      '',
    );

    norm.elements_ids = norm.elements.map(({ id }) => id);
    norm.objects_ids = norm.objects.map(({ id }) => id);
    norm.car_func_types_ids = norm.car_func_types.map(({ asuods_id }) => asuods_id);

    norm.objects_text_array = isString(norm.objects_text) ? norm.objects_text.split(', ') : [],

    norm.norm_registry_id = index + 1;
    return norm;
  }

  return null;
};

export const getBackNorm = (normRaw: any) => {
  const norm: Norm = cloneDeep(normRaw);

  delete norm.sensor_types_text;
  delete norm.elements_ids;
  delete norm.objects_ids;
  delete norm.car_func_types_ids;
  delete norm.norm_registry_id;

  delete norm.objects_text_array;

  return norm;
};

type PromiseGetNormPayload = (
  {}
  | {
    norm_ids: string[] | string;
  }
);

export const promiseGetNormsByParams = async (payload: PromiseGetNormPayload) => {
  let response = null;
  try {
    response = await CleaningNormRegistryService.get({
      ...payload,
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const result: Norm[] = get(response, 'result.rows', []);

  return result;
};

export const promiseGetNormByIdAndDate = async (payload: { norm_id: Norm['id'], datetime: string | Date }) => {
  let response = null;
  try {
    response = await CleaningNormRegistryService.path(payload.norm_id).get({
      datetime: createValidDateTime(payload.datetime),
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const result: Norm = get(response, 'result.rows.0', null);

  return result;
};

export const promiseSubmitNorm = (norm: Norm) => {
  if (!norm.id) {
    throw new Error('не определена функция создания');
  }
  return promiseUpdateNorm(norm);
};

export const promiseUpdateNorm = (norm: Norm) => {
  return CleaningNormRegistryService.path(norm.id).put(
    getBackNorm(norm),
    false,
    'json',
  );
};
