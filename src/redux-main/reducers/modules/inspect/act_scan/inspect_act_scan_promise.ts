
import { InspectOneActScan } from "./@types/inspect_act_scan";
import { InspectionService } from "api/Services";

export const promiseChangeActFiles = async (fileData: InspectOneActScan): Promise<InspectOneActScan> => {
  let response = null;

  response = await InspectionService.path(fileData.inspection_id).path('files').put(
    {
      files: fileData.files.map(
        (file) => ({
          ...file,
          notes: fileData.notes,
          kind: 'act_scan',
        }),
      ),
    },
    false,
    'json',
  );

  return response;
};
