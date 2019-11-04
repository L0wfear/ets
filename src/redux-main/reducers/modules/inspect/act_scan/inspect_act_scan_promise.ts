
import { InspectOneActScan } from './@types/inspect_act_scan';
import { InspectionService, FilesService } from 'api/Services';

export const makeInspectActScanFilesFront = (array: Array<InspectOneActScan>) => (
  array.reduce(
    (newArr, inspection) => {
      const { files = [] } = inspection;
      files.forEach(
        (file) => {
          if (file.kind === 'act_scan') {
            newArr.push({
              id: file.id,
              files: [file],
              name: file.name,
              notes: file.notes,
              url: file.url,
              inspection,
            });
          }
        },
      );

      return newArr;
    },
    [],
  )
);

export const promiseChangeActFiles = async (fileData: InspectOneActScan): Promise<InspectOneActScan> => {
  let response = null;
  const [oneFileData] = fileData.files;

  if (oneFileData.id) {
    return promiseUpdateActFiles(fileData);
  }

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
