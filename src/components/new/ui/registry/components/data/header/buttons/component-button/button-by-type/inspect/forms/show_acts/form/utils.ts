import { isObject, isNullOrUndefined } from 'util';
import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';

export const defaultInspectActFile: InspectOneActScan = {
  id: null,
  inspection_id: null,
  name: '',
  notes: '',
  base64: '',
  company_id: null,
  content_type: '',
  created_at: '',
  kind: '',
  object_id: null,
  status: '',
  subdir: '',
  updated_at: '',
  url: '',
};

export const getDefaultInspectActFileElement = (element: Partial<InspectOneActScan>): InspectOneActScan => {
  const newElement = { ...defaultInspectActFile };
  if (isObject(element)) {
    Object.keys(defaultInspectActFile).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultInspectActFile[key];
    });
  }

  return newElement;
};
