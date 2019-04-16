import { isObject, isNullOrUndefined } from 'util';
import { Efficiency } from 'redux-main/reducers/modules/efficiency/@types/efficiency';

export const defaultEfficiency: Efficiency = {
  id: null,
  technical_operation_name: '',
  technical_operation_id: null,
  source: '',
  areal_feature_name: '',
  areal_feature_id: null,
  ratio: null,
};

export const getDefaultEfficiencyElement = (element: Partial<Efficiency>): Efficiency => {
  const newElement = { ...defaultEfficiency };
  if (isObject(element)) {
    Object.keys(defaultEfficiency).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultEfficiency[key];
    });
  }

  return newElement;
};
