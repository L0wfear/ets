import { isObject, isNullOrUndefined } from 'util';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';

export type GetDefaultFountainsElement = (fountains: Fountains | null) => Fountains;

export const defaultFountains: Fountains = {
  adm_area: '',
  balance_holder_email: '',
  balance_holder_name: '',
  balance_holder_phone: '',
  balance_holder_web_site: '',
  company_name: '',
  created_at: null,
  departmental_affiliation: '',
  district: '',
  geo_data_json: {},
  geo_data_msk_json: {},
  global_id: null,
  id: null,
  location: '',
  name: '',
  number: null,
  operation_organization_email: '',
  operation_organization_name: '',
  operation_organization_phone: '',
  shape: {},
  updated_at: null,
  working_hours: [],
  working_hours_text: '',
};

export const getDefaultFountainsFormElement: GetDefaultFountainsElement = (element) => {
  const newElement = { ...defaultFountains };
  if (isObject(element)) {
    Object.keys(defaultFountains).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultFountains[key];
    });
  }

  return newElement;
};
