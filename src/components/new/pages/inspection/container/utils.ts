import { isObject, isNullOrUndefined } from 'util';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';

export const makeDefaultInspectContainer = (): InspectContainer => ({
  inspection_id: null,
  number: '',
  capacity: null,
  capacity_percent: null,
  pgm_volume: null,
  pgm_marka: '',
  last_checked_at: null,
  diagnostic_result: '',
  data: {
    equipment_pipeline_in_poor_condition: false,
    control_measuring_instruments_in_poor_condition: false,
  },
  actions: [],
});

export const getDefaultInspectContainerElement = (
  element?: Partial<InspectContainer>,
) => {
  const newElement = makeDefaultInspectContainer();
  if (isObject(element)) {
    Object.keys(newElement).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};
