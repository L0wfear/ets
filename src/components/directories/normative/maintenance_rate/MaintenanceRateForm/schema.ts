import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { ICreateMaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import { PropsMaintenanceRate } from 'components/directories/normative/maintenance_rate/MaintenanceRateForm/@types/MaintenanceRate.h';

export const maintenanceRateSchema: SchemaType<ICreateMaintenanceRate, PropsMaintenanceRate> = {
  properties: {
    technical_operation_id: {
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    maintenance_work_id: {
      title: 'Наименование регламентной работы',
      type: 'valueOfArray',
      required: true,
    },
    season_id: {
      title: 'Сезон',
      type: 'valueOfArray',
      required: true,
    },
    clean_category_id: {
      title: 'Категория',
      type: 'valueOfArray',
      required: true,
    },
    clean_subcategory_id: {
      title: 'Подкатегория',
      type: 'valueOfArray',
      required: false,
    },
    value: {
      title: 'Норма',
      type: 'number',
      float: 3,
      required: true,
    },
  },
};
