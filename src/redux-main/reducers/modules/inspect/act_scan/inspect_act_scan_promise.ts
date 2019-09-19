
import { InspectOneActScan } from './@types/inspect_act_scan';
import { InspectionService } from 'api/Services';

export const makeInspectActScanFilesFront = (array: InspectOneActScan[]) => (
  array.reduce(
    (newArr, { files = [] }) => {
      files.forEach(
        (file) => {
          if (file.kind === 'act_scan') {
            newArr.push({
              id: file.id,
              files: [file],
              name: file.name,
              notes: file.notes,
              url: file.url,
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
