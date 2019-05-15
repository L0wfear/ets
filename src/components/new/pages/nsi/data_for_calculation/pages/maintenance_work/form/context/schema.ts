import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import { SchemaFormContext } from 'components/new/utils/context/@types';

export const maintenanceWorkFormSchema: SchemaFormContext<MaintenanceWork> = {
  header: {
    type: 'default',
    title: [
      {
        title: 'Добавление расходного материала',
        disaplayIf: 'IS_CREATING',
      },
      {
        title: 'Изменение расходного материала',
        disaplayIf: 'IS_CREATING',
        reverse: true,
      },
    ],
  },
  body: {
    fields: [
      {
        key: 'name',
        title: 'Наименование',
        required: true,
      },
      {
        key: 'measure_unit_id',
        title: 'Единица измерения',
        required: true,
        clearable: false,
      },
    ],
  },
  footer: {
    type: 'default',
    buttons: [
      [
        'save',
        'cancel',
      ],
    ],
  },
};
