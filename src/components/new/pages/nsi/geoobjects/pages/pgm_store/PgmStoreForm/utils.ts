import { isObject, isNullOrUndefined } from 'util';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';

export type GetDefaultPgmStoreElement = (PgmStore: PgmStore | null) => PgmStore;

export const defaultPgmStore: PgmStore = {
  address: '',
  company_name: '',
  company_id: null,
  id: null,
  liquid_pgm_volume: null,
  name: '',
  pgm_stores_type_id: null,
  pgm_stores_type_name: '',
  shape: {},
  solid_pgm_volume: null,
};

export const getDefaultPgmStoreFormElement: GetDefaultPgmStoreElement = (element) => {
  const newElement = { ...defaultPgmStore };
  if (isObject(element)) {
    Object.keys(defaultPgmStore).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultPgmStore[key];
    });
  }

  return newElement;
};
