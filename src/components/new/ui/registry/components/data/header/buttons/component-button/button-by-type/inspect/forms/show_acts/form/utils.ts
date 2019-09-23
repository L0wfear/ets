import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';

import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';

export const defaultInspectActFile: InspectOneActScan = {
  id: null,
  inspection_id: null,
  files: [],
  notes: '',
  name: '',
};

export const getDefaultInspectActFileElement = (element: Partial<InspectOneActScan>): InspectOneActScan => {
  const newElement = cloneDeep(defaultInspectActFile);
  if (isObject(element)) {
    Object.keys(defaultInspectActFile).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultInspectActFile[key];
    });
  }

  return newElement;
};
