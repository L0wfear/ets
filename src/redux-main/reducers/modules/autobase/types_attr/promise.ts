import { TypesAttrService } from 'api/Services';
import { get } from 'lodash';
import { TypesAttr } from '../@types/autobase.h';

export const getFrontTypesAttr = (typesAttr: TypesAttr, index: number) => {
  typesAttr.id = index + 1;

  return typesAttr;
};

export const promiseLoadTypesAttr = async (payload = {}) => {
  let result = null;
  try {
    result = await TypesAttrService.get({ ...payload });
  } catch (error) {
    console.info(error); // eslint-disable-line
  }

  const data: Array<TypesAttr> = get(result, 'result.rows', []);

  return {
    data,
  };
};

export const promiseLoadPFTypesAttr = async (payloadOwn) => {
  return TypesAttrService.getBlob(payloadOwn);
};

export const promiseCreateTypesAttr = (oldTypesAttr) => {
  const payload = {
    ...oldTypesAttr,
  };

  return TypesAttrService.post(payload, false, 'json');
};

export const promiseUpdateTypesAttr = (oldTypesAttr) => {
  const payload = {
    asuods_id: oldTypesAttr.asuods_id,
    avg_work_hours: oldTypesAttr.avg_work_hours,
  };

  return TypesAttrService.put(payload, false, 'json');
};
