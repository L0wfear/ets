import { isObject, isNullOrUndefined } from 'util';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';

export const defaultOdh: Odh = {
  auto_footway_area: null,
  auto_roadway_clean_area: null,
  clean_category_name: '',
  cleaning_area: null,
  company_id: null,
  company_name: '',
  company_structures: [],
  customer_id: null,
  distance: null,
  footway_area: null,
  footway_length: null,
  gutters_length: null,
  id: null,
  manual_footway_area: null,
  margin_area: null,
  name: '',
  roadway_area: null,
  shape: {},
  snow_area: null,
  total_area: null,
  total_auto_clean_area: null,
};

export const getDefaultOdhFormElement = (element: Partial<Odh>): Odh => {
  const newElement = { ...defaultOdh };
  if (isObject(element)) {
    Object.keys(defaultOdh).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultOdh[key];
    });
  }

  return newElement;
};
