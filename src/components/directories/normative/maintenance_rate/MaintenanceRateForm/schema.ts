import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import {
  ICreateMaintenanceRate
} from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import {
  PropsMaintenanceRate,
} from 'components/directories/normative/maintenance_rate/MaintenanceRateForm/@types/MaintenanceRate.h';

export const maintenanceRateSchema: SchemaType<ICreateMaintenanceRate, PropsMaintenanceRate> = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'maintenance_work_id',
      title: 'Наименование регламентной работы',
      type: 'number',
      required: true,
    },
    {
      key: 'season_id',
      title: 'Сезон',
      type: 'number',
      required: true,
    },
    {
      key: 'clean_category_id',
      title: 'Категория',
      type: 'number',
      required: true,
    },
    {
      key: 'clean_subcategory_id',
      title: 'Подкатегория',
      type: 'number',
      required: false,
    },
    {
      key: 'value',
      title: 'Норма',
      type: 'number',
      float: 3,
      required: true,
    },
  ],
};
