
import { InspectOneActScan } from "./@types/inspect_act_scan";
import { InspectionService, FilesService } from "api/Services";

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
      notes: fileData.notes,
    },
    false,
    'json',
  );

  return response;
};

export const promiseUpdateActFiles = async (fileData: InspectOneActScan): Promise<InspectOneActScan> => {
  let response = null;
  const [oneFileData] = fileData.files;

  response = await FilesService.path(fileData.id).put(
    {
      ...oneFileData,
      notes: fileData.notes,
    },
    false,
    'json',
  );

  return response;
};
