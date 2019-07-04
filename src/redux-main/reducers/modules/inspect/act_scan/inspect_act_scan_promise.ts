import { get } from 'lodash';

import { InspectActScan, InspectOneActScan } from "./@types/inspect_act_scan";
import { InspectionActScanService } from "api/Services";

export const promiseLoadActFileData = async (file_id: InspectActScan['id']): Promise<InspectOneActScan> => {
  let respose = null;

  try {
    respose = await InspectionActScanService.path(file_id).get();
  } catch (error) {
    console.log(error); // tslint:disable-line
  }

  return {
    id: file_id,
    ...get(respose, 'result.rows.0', null),
  };
};

export const promisePostActFileData = async (fileData: InspectOneActScan): Promise<InspectOneActScan> => {
  const respose = await InspectionActScanService.post(
    {
      id: fileData.id,
      inspection_id: fileData.inspection_id,
      name: fileData.name,
      notes: fileData.notes,
      base64: fileData.base64,
    },
    false,
    'json',
  );

  return {
    ...fileData,
    ...get(respose, 'result.rows.0', null),
  };
};

export const promisePutActFileData = async (fileData: InspectOneActScan): Promise<InspectOneActScan> => {
  const respose = await InspectionActScanService.path(fileData.id).put(
    {
      notes: fileData.notes,
    },
    false,
    'json',
  );

  return {
    ...fileData,
    ...get(respose, 'result.rows.0', null),
  };
};
