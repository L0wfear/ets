import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { MaintenanceWork } from 'redux-main/reducers/modules/maintenance_work/@types/maintenanceWork';
import { PropsMaintenanceWork } from './@types/MaintenanceWorkForm';

export const maintenanceWorkFormSchema: SchemaType<MaintenanceWork, PropsMaintenanceWork> = {
  properties: {
    name: {
      title: 'Наименование',
      type: 'string',
      required: true,
    },
    measure_unit_id: {
      title: 'Единица измерения',
      type: 'valueOfArray',
      required: true,
    },
  },
};
