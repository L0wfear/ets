import { isObject, isNullOrUndefined } from 'util';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';

export type GetDefaultSnowStorageElement = (SnowStorage: SnowStorage | null) => SnowStorage;

export const defaultSnowStorage: SnowStorage = {
  address: '',
  company_name: '',
  id: null,
  name: '',
  okrug_name: null,
  shape: {},
};

export const getDefaultSnowStorageFormElement: GetDefaultSnowStorageElement = (element) => {
  const newElement = { ...defaultSnowStorage };
  if (isObject(element)) {
    Object.keys(defaultSnowStorage).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultSnowStorage[key];
    });
  }

  return newElement;
};
