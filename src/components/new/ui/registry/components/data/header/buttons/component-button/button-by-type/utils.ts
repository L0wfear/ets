import { get } from 'lodash';
import { isString, isObject, isNull } from 'util';

import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

type makePayloadToParamsForReadFunc = (
  dataOwn: ValuesOf<OneRegistryData['header']['buttons']>,
  rowData: object,
  uniqKeyForParams: string,
  uniqKey: string,
) => Record<string, string | number>;

export const makePayloadToParamsForRead: makePayloadToParamsForReadFunc = (dataOwn, rowData, uniqKeyForParams, uniqKey) => {
  const data = dataOwn || {} as ValuesOf<OneRegistryData['header']['buttons']>;
  const {
    otherUniqKeyForParamsData,
    type,
    ...other
  } = data.other_params || {};

  const changeObj: any = {};

  if (!isNull(otherUniqKeyForParamsData)) {
    const keyParams = get(otherUniqKeyForParamsData, 'key') || uniqKeyForParams;
    const path = get(otherUniqKeyForParamsData, 'path') || uniqKey;
    const paramsValue = get(rowData, path, null);

    changeObj[keyParams] = paramsValue;
  }

  if (!isNull(type)) {
    changeObj.type = type || null;
  }

  Object.entries(other).forEach(
    ([key, value]) => {
      if (isString(value)) {
        changeObj[key] = value;
        return;
      }
      if (isObject(value)) {
        changeObj[key] = get(rowData, value.path);
        return;
      }
    },
  );

  return changeObj;
};
