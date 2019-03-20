import { TypesService } from 'api/Services';
import { get } from 'lodash';

export const promiseLoadCarFuncTypess = async (payload = {}) => {
  let result = null;
  try {
    result = await TypesService.get({ ...payload });
  } catch (error) {
    console.log(error); // tslint:disable-line:no-console
  }

  return {
    data: get(result, ['result', 'rows'], []),
  };
};

export const promiseLoadPFCarFuncTypess = async (payloadOwn) => {
  return TypesService.getBlob(payloadOwn);
};

export const promiseCreateCarFuncTypes = (oldCarFuncTypes) => {
  const payload = {
    ...oldCarFuncTypes,
  };

  return TypesService.post(payload, false, 'json');
};

export const promiseUpdateCarFuncTypes = (oldCarFuncTypes) => {
  const payload = {
    asuods_id: oldCarFuncTypes.asuods_id,
    avg_work_hours: oldCarFuncTypes.avg_work_hours,
  };

  return TypesService.put(payload, false, 'json');
};
