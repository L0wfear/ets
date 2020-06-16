import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import maintenanceWorkPermissions from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/_config-data/permissions';
import { ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { submitMaintenanceWork } from 'redux-main/reducers/modules/maintenance_work/promise_maintenance_work';

export const metaMaintenanceWork: ConfigFormData<MaintenanceWork> = {
  uniqField: 'id',
  bsSizeForm: 'small',
  permissions: maintenanceWorkPermissions,
  handleSubmitPromise: submitMaintenanceWork,
  schema: {
    header: {
      title: {
        create: 'Добавление показателя регламентных работ',
        update: 'Изменение показателя регламентных работ',
      },
    },
    body: {
      validate_fields: {
        name: {
          type: 'string',
          title: 'Наименование',
          required: true,
        },
        measure_unit_id: {
          type: 'valueOfArray',
          title: 'Единица измерения',
          required: true,
        },
      },
    },
  },
  getDefaultElement: (reduxState) => ({
    id: null,
    name: '',
    measure_unit_id: null,
    measure_unit_name: '',
  }),
};
