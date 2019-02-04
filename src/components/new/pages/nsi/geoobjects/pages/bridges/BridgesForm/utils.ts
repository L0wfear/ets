import { isObject, isNullOrUndefined } from 'util';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';

export type GetDefaultBridgesElement = (bridges: Bridges | null) => Bridges;

export const defaultBridges: Bridges = {
  created_at: null,
  crossing: '',
  district: [],
  district_text: '',
  geo_data_json: {},
  geo_data_msk_json: {},
  global_id: null,
  id: null,
  location: '',
  name: '',
  number: null,
  shape: {},
  updated_at: null,
  year_of_commissioning: null,
};

export const getDefaultBridgesFormElement: GetDefaultBridgesElement = (element) => {
  const newElement = { ...defaultBridges };
  if (isObject(element)) {
    Object.keys(defaultBridges).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultBridges[key];
    });
  }

  return newElement;
};
