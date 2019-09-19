import inspectActScanPermissions from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/registry/permissions';
import { ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';
import { promiseChangeActFiles } from 'redux-main/reducers/modules/inspect/act_scan/inspect_act_scan_promise';

export const metaInspectOneActScan: ConfigFormData<InspectOneActScan> = {
  uniqField: 'id',
  bsSizeForm: 'small',
  permissions: inspectActScanPermissions,
  handleSubmitPromise: promiseChangeActFiles,
  schema: {
    header: {
      title: {
        create: 'Загрузка файла',
        update: 'Загрузка файла',
      },
    },
    body: {
      validate_fields: {
        files: {
          title: 'Файл',
          type: 'multiValueOfArray',
          dependencies: [
            (files) => {
              if (!files.length) {
                return 'Поле "Файл" должно быть заполнено';
              }
            },
          ],
        },
        notes: {
          title: 'Примечание',
          type: 'string',
          required: true,
          maxLength: 400,
        },
      },
    },
  },
  default_element: {
    id: null,
    inspection_id: null,
    files: [],
    notes: '',
    name: '',
  },
};
